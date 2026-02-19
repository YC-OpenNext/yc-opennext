import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { Readable } from 'stream';
import crypto from 'crypto';

export interface ISRCacheOptions {
  region?: string;
  s3Endpoint?: string;
  dynamoEndpoint?: string;
  cacheBucket: string;
  tablesPrefix?: string;
  buildId: string;
}

export interface CacheEntry {
  key: string;
  value: string | Buffer;
  metadata?: {
    headers?: Record<string, string>;
    status?: number;
    tags?: string[];
    revalidateAfter?: number;
  };
}

export class ISRCache {
  private s3Client: S3Client;
  private dynamoClient: DynamoDBDocumentClient;
  private cacheBucket: string;
  private buildId: string;
  private tablesPrefix: string;

  constructor(options: ISRCacheOptions) {
    const {
      region = 'ru-central1',
      s3Endpoint = 'https://storage.yandexcloud.net',
      dynamoEndpoint,
      cacheBucket,
      tablesPrefix = 'isr',
      buildId,
    } = options;

    this.cacheBucket = cacheBucket;
    this.buildId = buildId;
    this.tablesPrefix = tablesPrefix;

    // Initialize S3 client for cache storage
    this.s3Client = new S3Client({
      region,
      endpoint: s3Endpoint,
    });

    // Initialize DynamoDB client for YDB DocAPI
    const rawDynamoClient = new DynamoDBClient({
      region,
      endpoint: dynamoEndpoint,
    });

    this.dynamoClient = DynamoDBDocumentClient.from(rawDynamoClient, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  /**
   * Get cache entry
   */
  async get(key: string): Promise<CacheEntry | null> {
    console.log('[ISR] Getting cache entry:', key);

    try {
      // Get metadata from DynamoDB
      const metadataResponse = await this.dynamoClient.send(
        new GetCommand({
          TableName: `${this.tablesPrefix}_entries`,
          Key: {
            pk: this.getCacheKey(key),
            sk: 'metadata',
          },
        })
      );

      if (!metadataResponse.Item) {
        console.log('[ISR] Cache miss:', key);
        return null;
      }

      const metadata = metadataResponse.Item;

      // Check if entry is stale
      if (metadata.revalidateAfter && Date.now() > metadata.revalidateAfter) {
        console.log('[ISR] Cache entry stale:', key);
        // Return stale entry but mark for revalidation
        this.scheduleRevalidation(key);
      }

      // Get blob from S3
      const s3Key = this.getS3Key(key);
      const s3Response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.cacheBucket,
          Key: s3Key,
        })
      );

      if (!s3Response.Body) {
        return null;
      }

      const value = await this.streamToBuffer(s3Response.Body as Readable);

      console.log('[ISR] Cache hit:', key);

      return {
        key,
        value,
        metadata: {
          headers: metadata.headers,
          status: metadata.status,
          tags: metadata.tags,
          revalidateAfter: metadata.revalidateAfter,
        },
      };
    } catch (error: any) {
      if (error.Code !== 'NoSuchKey' && error.name !== 'ResourceNotFoundException') {
        console.error('[ISR] Cache get error:', error);
      }
      return null;
    }
  }

  /**
   * Set cache entry
   */
  async set(entry: CacheEntry): Promise<void> {
    console.log('[ISR] Setting cache entry:', entry.key);

    try {
      const cacheKey = this.getCacheKey(entry.key);
      const s3Key = this.getS3Key(entry.key);

      // Save blob to S3
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.cacheBucket,
          Key: s3Key,
          Body: entry.value,
          ContentType: 'application/octet-stream',
          Metadata: {
            buildId: this.buildId,
            timestamp: Date.now().toString(),
          },
        })
      );

      // Save metadata to DynamoDB
      const metadata = {
        pk: cacheKey,
        sk: 'metadata',
        ...entry.metadata,
        buildId: this.buildId,
        timestamp: Date.now(),
        ttl: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days TTL
      };

      await this.dynamoClient.send(
        new PutCommand({
          TableName: `${this.tablesPrefix}_entries`,
          Item: metadata,
        })
      );

      // Update tag mappings if tags present
      if (entry.metadata?.tags && entry.metadata.tags.length > 0) {
        await this.updateTagMappings(entry.key, entry.metadata.tags);
      }

      console.log('[ISR] Cache entry saved:', entry.key);
    } catch (error) {
      console.error('[ISR] Cache set error:', error);
      throw error;
    }
  }

  /**
   * Delete cache entry
   */
  async delete(key: string): Promise<void> {
    console.log('[ISR] Deleting cache entry:', key);

    try {
      const cacheKey = this.getCacheKey(key);
      const s3Key = this.getS3Key(key);

      // Delete from S3
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.cacheBucket,
          Key: s3Key,
        })
      );

      // Delete from DynamoDB
      await this.dynamoClient.send(
        new DeleteCommand({
          TableName: `${this.tablesPrefix}_entries`,
          Key: {
            pk: cacheKey,
            sk: 'metadata',
          },
        })
      );

      console.log('[ISR] Cache entry deleted:', key);
    } catch (error) {
      console.error('[ISR] Cache delete error:', error);
    }
  }

  /**
   * Revalidate by path
   */
  async revalidatePath(path: string): Promise<void> {
    console.log('[ISR] Revalidating path:', path);

    try {
      // Query all entries for this path
      const response = await this.dynamoClient.send(
        new QueryCommand({
          TableName: `${this.tablesPrefix}_paths`,
          KeyConditionExpression: 'pk = :path',
          ExpressionAttributeValues: {
            ':path': path,
          },
        })
      );

      const entries = response.Items || [];

      // Delete all cache entries for this path
      for (const entry of entries) {
        await this.delete(entry.cacheKey);
      }

      console.log(`[ISR] Revalidated ${entries.length} entries for path: ${path}`);
    } catch (error) {
      console.error('[ISR] Path revalidation error:', error);
      throw error;
    }
  }

  /**
   * Revalidate by tag
   */
  async revalidateTag(tag: string): Promise<void> {
    console.log('[ISR] Revalidating tag:', tag);

    try {
      // Query all entries with this tag
      const response = await this.dynamoClient.send(
        new QueryCommand({
          TableName: `${this.tablesPrefix}_tags`,
          KeyConditionExpression: 'pk = :tag',
          ExpressionAttributeValues: {
            ':tag': `tag#${tag}`,
          },
        })
      );

      const entries = response.Items || [];

      // Delete all cache entries with this tag
      for (const entry of entries) {
        await this.delete(entry.cacheKey);
      }

      console.log(`[ISR] Revalidated ${entries.length} entries for tag: ${tag}`);
    } catch (error) {
      console.error('[ISR] Tag revalidation error:', error);
      throw error;
    }
  }

  /**
   * Update tag mappings for a cache entry
   */
  private async updateTagMappings(key: string, tags: string[]): Promise<void> {
    const cacheKey = this.getCacheKey(key);
    const requests: any[] = [];

    for (const tag of tags) {
      requests.push({
        PutRequest: {
          Item: {
            pk: `tag#${tag}`,
            sk: cacheKey,
            cacheKey,
            tag,
            buildId: this.buildId,
            timestamp: Date.now(),
            ttl: Math.floor(Date.now() / 1000) + 86400 * 30,
          },
        },
      });
    }

    // Batch write tag mappings
    if (requests.length > 0) {
      const chunks = this.chunkArray(requests, 25); // DynamoDB batch limit

      for (const chunk of chunks) {
        await this.dynamoClient.send(
          new BatchWriteCommand({
            RequestItems: {
              [`${this.tablesPrefix}_tags`]: chunk,
            },
          })
        );
      }
    }
  }

  /**
   * Schedule background revalidation
   */
  private scheduleRevalidation(key: string): void {
    // In a real implementation, this would enqueue a job to YMQ
    // For now, we'll just log it
    console.log('[ISR] Scheduling revalidation for:', key);
  }

  /**
   * Get cache key with build ID
   */
  private getCacheKey(key: string): string {
    return `${this.buildId}#${key}`;
  }

  /**
   * Get S3 key for cache blob
   */
  private getS3Key(key: string): string {
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    return `cache/${this.buildId}/${hash.substring(0, 2)}/${hash}`;
  }

  /**
   * Convert stream to buffer
   */
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

/**
 * Create ISR cache instance from environment
 */
export function createISRCache(): ISRCache | null {
  const cacheBucket = process.env.CACHE_BUCKET;
  const buildId = process.env.BUILD_ID || 'development';
  const dynamoEndpoint = process.env.YDB_DOCAPI_ENDPOINT;

  if (!cacheBucket || !dynamoEndpoint) {
    console.warn('[ISR] Cache not configured, running without cache');
    return null;
  }

  return new ISRCache({
    cacheBucket,
    buildId,
    dynamoEndpoint,
    region: process.env.YC_REGION || 'ru-central1',
    s3Endpoint: process.env.S3_ENDPOINT || 'https://storage.yandexcloud.net',
    tablesPrefix: process.env.TABLES_PREFIX || 'isr',
  });
}