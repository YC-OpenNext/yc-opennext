# Example: Blog with ISR

Build a performant blog with Incremental Static Regeneration on Yandex Cloud.

## Overview

This example demonstrates:

- ✅ Static generation with ISR
- ✅ On-demand revalidation
- ✅ Tag-based cache invalidation
- ✅ Markdown content with MDX
- ✅ Image optimization
- ✅ SEO optimization

## Project Structure

```
my-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── blog/
│   │   ├── page.tsx           # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx       # Blog post
│   └── api/
│       └── revalidate/
│           └── route.ts       # Revalidation endpoint
├── lib/
│   ├── blog.ts               # Blog utilities
│   └── cache.ts              # Cache helpers
├── content/
│   └── posts/                # Markdown posts
│       ├── first-post.mdx
│       └── second-post.mdx
└── next.config.js
```

## Step 1: Set Up the Blog

### Install Dependencies

```bash
npm install @next/mdx @mdx-js/loader gray-matter reading-time
npm install --save-dev @types/mdx
```

### Configure Next.js

```javascript
// next.config.js
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

export default withMDX(nextConfig);
```

## Step 2: Create Blog Data Layer

### Blog Utilities

```typescript
// lib/blog.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  author: string;
  image: string;
  content: string;
  readingTime: number;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

// Cache the post fetching function
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const post = await getPostBySlug(slug);
      return post;
    }),
  );

  // Sort by date
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost> => {
  const realSlug = slug.replace(/\.mdx?$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  // Calculate reading time (200 words per minute)
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/g).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return {
    slug: realSlug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    tags: data.tags || [],
    author: data.author,
    image: data.image,
    content,
    readingTime,
  };
});

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
```

## Step 3: Create Blog Pages

### Blog Listing Page

```typescript
// app/blog/page.tsx
import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.slug} className="card">
            <Link href={`/blog/${post.slug}`}>
              <Image
                src={post.image}
                alt={post.title}
                width={400}
                height={250}
                className="rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### Individual Blog Post

```typescript
// app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// Generate static params for all posts
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ISR: Revalidate after 60 seconds
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

// Custom MDX components
const components = {
  Image,
  // Add more custom components as needed
};

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <span>By {post.author}</span>
          <span>•</span>
          <time>{post.date}</time>
          <span>•</span>
          <span>{post.readingTime} min read</span>
        </div>

        <div className="flex gap-2 mb-6">
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="tag hover:bg-gray-200"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <Image
          src={post.image}
          alt={post.title}
          width={1200}
          height={630}
          className="rounded-lg w-full"
          priority
        />
      </header>

      <div className="prose prose-lg max-w-none">
        <MDXRemote source={post.content} components={components} />
      </div>
    </article>
  );
}
```

## Step 4: Implement Revalidation

### Revalidation API Endpoint

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Verify HMAC signature for security
function verifySignature(body: string, signature: string, secret: string) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function POST(request: NextRequest) {
  try {
    // Get signature from header
    const signature = request.headers.get('x-revalidate-signature');
    const secret = process.env.REVALIDATE_SECRET!;

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Get and verify body
    const body = await request.text();
    const data = JSON.parse(body);

    if (!verifySignature(body, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Revalidate based on type
    const { type, value } = data;

    if (type === 'path') {
      // Revalidate specific path
      revalidatePath(value);
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        value,
      });
    } else if (type === 'tag') {
      // Revalidate by tag
      revalidateTag(value);
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        value,
      });
    } else if (type === 'all') {
      // Revalidate everything
      revalidatePath('/blog');
      return NextResponse.json({
        revalidated: true,
        type: 'all',
      });
    }

    return NextResponse.json({ error: 'Invalid revalidation type' }, { status: 400 });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Revalidation Script

```javascript
// scripts/revalidate.js
const crypto = require('crypto');
const fetch = require('node-fetch');

async function revalidate(type, value) {
  const url = 'https://your-app.example.com/api/revalidate';
  const secret = process.env.REVALIDATE_SECRET;

  const body = JSON.stringify({ type, value });
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const signature = hmac.digest('hex');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-signature': signature,
    },
    body,
  });

  const result = await response.json();
  console.log('Revalidation result:', result);
}

// Usage
// revalidate('path', '/blog/my-post');
// revalidate('tag', 'javascript');
// revalidate('all', null);
```

## Step 5: Deploy to Yandex Cloud

### Build and Package

```bash
# Build the blog
npm run build

# Package for YC
yc-opennext build \
  --project . \
  --output ./yc-build \
  --standalone

# Upload to YC
yc-opennext upload \
  --build-dir ./yc-build \
  --bucket blog-assets \
  --cache-bucket blog-cache \
  --prefix v1
```

### Terraform Configuration

```hcl
# terraform/main.tf
module "blog" {
  source = "github.com/yc-opennext/yc-opennext//terraform/modules/nextjs_yc"

  app_name    = "my-blog"
  env         = "production"
  cloud_id    = var.cloud_id
  folder_id   = var.folder_id
  domain_name = "blog.example.com"
  build_id    = "v1"
  manifest_path = "./yc-build/deploy.manifest.json"

  # Enable ISR with YDB
  enable_isr = true

  # Cache configuration
  cache_ttl_days = 30

  # Function configuration for blog
  function_memory = {
    server = 512  # Sufficient for blog
    image  = 256
  }

  function_timeout = {
    server = 30
    image  = 30
  }

  # Optimize for read-heavy workload
  prepared_instances = {
    server = 1
    image  = 0
  }
}
```

### Deploy

```bash
terraform init
terraform apply
```

## Step 6: Set Up CMS Integration (Optional)

### Webhook from CMS

Configure your CMS to call the revalidation endpoint when content changes:

```javascript
// CMS webhook handler example
async function onContentUpdate(event) {
  const { type, slug, tags } = event;

  if (type === 'post.updated') {
    // Revalidate the specific post
    await callRevalidateAPI('path', `/blog/${slug}`);

    // Revalidate tags
    for (const tag of tags) {
      await callRevalidateAPI('tag', tag);
    }

    // Revalidate blog listing
    await callRevalidateAPI('path', '/blog');
  }
}
```

## Performance Optimizations

### 1. Optimize Images

```typescript
// Use Next.js Image with proper sizing
<Image
  src={post.image}
  alt={post.title}
  width={1200}
  height={630}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index < 3} // Priority for above-fold images
/>
```

### 2. Implement Pagination

```typescript
// app/blog/page.tsx with pagination
export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const postsPerPage = 9;
  const posts = await getAllPosts();

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);

  // Render paginated posts...
}
```

### 3. Add Search

```typescript
// lib/search.ts
export async function searchPosts(query: string) {
  const posts = await getAllPosts();

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
  );
}
```

## Monitoring

### Track Cache Performance

```typescript
// lib/cache.ts
export async function getCacheStats() {
  // Query YDB for cache hit/miss rates
  const stats = await queryYDB(
    `
    SELECT COUNT(*) as total,
           SUM(CASE WHEN hit = true THEN 1 ELSE 0 END) as hits
    FROM cache_logs
    WHERE timestamp > ?
  `,
    [Date.now() - 86400000],
  ); // Last 24 hours

  return {
    hitRate: (stats.hits / stats.total) * 100,
    total: stats.total,
  };
}
```

## Conclusion

This blog implementation demonstrates:

- ✅ ISR for optimal performance
- ✅ On-demand revalidation for fresh content
- ✅ Tag-based invalidation for related content
- ✅ SEO optimization with metadata
- ✅ Image optimization
- ✅ MDX for rich content

The blog will perform excellently on Yandex Cloud with:

- Fast initial loads from cache
- Automatic background regeneration
- Efficient cache invalidation
- Scalable to millions of posts
