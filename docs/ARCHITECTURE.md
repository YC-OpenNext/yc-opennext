# YC-OpenNext Architecture

## Overview

YC-OpenNext implements a Vercel-like deployment system for Next.js applications on Yandex Cloud, without using serverless containers.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            User Requests                            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway                                 │
│                    (Custom Domain + TLS)                           │
│                                                                     │
│  Routes:                                                           │
│  • /_next/static/* → Object Storage                               │
│  • /public/*       → Object Storage                               │
│  • /_next/image    → Image Function                               │
│  • /api/*          → Server Function                              │
│  • /*              → Server Function                              │
└──────┬────────────────────┬──────────────────┬─────────────────────┘
       │                    │                  │
       ▼                    ▼                  ▼
┌──────────────┐    ┌──────────────┐   ┌──────────────┐
│   Static     │    │    Server    │   │    Image     │
│   Assets     │    │   Function   │   │  Optimizer   │
│              │    │              │   │              │
│  Object      │    │  • SSR       │   │  • Resize    │
│  Storage     │    │  • API       │   │  • Format    │
│              │    │  • Middleware│   │  • Cache     │
└──────────────┘    └──────┬───────┘   └──────┬───────┘
                           │                   │
                           ▼                   ▼
                    ┌──────────────────────────┐
                    │    Data Layer            │
                    │                          │
                    │  • YDB DocAPI (Metadata)│
                    │  • Object Storage (Cache)│
                    │  • Lockbox (Secrets)    │
                    └──────────────────────────┘
```

## Component Details

### 1. Build & Deploy Pipeline

The deployment process consists of three stages:

#### Build Stage (yc-opennext CLI)
1. **Analysis**: Detect Next.js version and capabilities
2. **Validation**: Check compatibility matrix
3. **Packaging**: Create function bundles and static assets
4. **Manifest**: Generate deployment descriptor

#### Upload Stage
1. Upload static assets to Object Storage
2. Upload function packages
3. Initialize cache structures

#### Deploy Stage (Terraform)
1. Provision infrastructure
2. Deploy function versions
3. Update API Gateway routes
4. Switch traffic atomically

### 2. Request Flow

#### Static Assets
```
Client → API Gateway → Object Storage
```
- Direct serving from Object Storage
- Immutable assets with long cache headers
- Versioned by build ID

#### Dynamic Requests (SSR/API)
```
Client → API Gateway → Server Function → Next.js Handler
                            ↓
                        Middleware
                            ↓
                        Data Cache
```

#### Image Optimization
```
Client → API Gateway → Image Function → Source Image
                            ↓
                        Transform
                            ↓
                        Cache Result
```

### 3. ISR & Data Cache

#### Cache Architecture
```
┌─────────────────────┐
│   Cache Request     │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │  Check YDB  │
    │  Metadata   │
    └──────┬──────┘
           │
    Is Valid?
    ├─Yes──→ Fetch from S3
    │
    └─No───→ Regenerate
              ├─→ Update S3
              └─→ Update YDB
```

#### YDB DocAPI Tables

**isr_entries**
- Primary: buildId + path
- Attributes: headers, status, tags, revalidateAfter, ttl

**isr_tags**
- Primary: tag
- Range: cacheKey
- Used for tag-based invalidation

**isr_paths**
- Primary: path
- Range: buildId
- Used for path-based invalidation

**isr_locks**
- Primary: lockKey
- TTL-based expiry for concurrency control

### 4. Middleware Execution

#### Edge-Emulated Mode (Default)
```javascript
// Polyfilled Web APIs
Request, Response, Headers, URL
fetch (via undici)
crypto.subtle (limited)
TextEncoder/Decoder
```

#### Node-Fallback Mode
- Direct Node.js execution
- No Web API polyfills
- Better compatibility, different semantics

### 5. Blue-Green Deployment

Every deployment creates immutable, versioned resources:

```
v1 (Current):
  - Assets: s3://bucket/assets/build-v1/*
  - Functions: server-v1, image-v1
  - Routes: API Gateway → v1

v2 (New):
  - Assets: s3://bucket/assets/build-v2/*
  - Functions: server-v2, image-v2
  - Routes: Update API Gateway → v2

Rollback:
  - Routes: Update API Gateway → v1
```

## Security Architecture

### Secrets Management
- All secrets stored in Yandex Lockbox
- Function access via IAM roles
- No plaintext in Terraform state

### Encryption
- KMS keys for all storage
- TLS enforced at all endpoints
- Encrypted function environment variables

### Access Control
- Private by default
- Service accounts with least privilege
- API Gateway as single public entry point

## Performance Optimizations

### Cold Start Mitigation
- Prepared function instances
- Bundled dependencies (standalone mode)
- Optimized runtime initialization

### Caching Strategy
- Static assets: Immutable, long TTL
- ISR pages: Stale-while-revalidate
- Image optimization: Cache transformed images
- API responses: Optional cache headers

### Scaling
- Functions: Auto-scale based on load
- Storage: Unlimited capacity
- YDB: Serverless, auto-scaling
- API Gateway: Managed scaling

## Monitoring & Observability

### Logs
- Function execution logs
- API Gateway access logs
- Error tracking with structured logging

### Metrics
- Function invocations, duration, errors
- Storage bandwidth, requests
- Cache hit rates
- YDB operations

### Tracing
- Request ID propagation
- Function execution traces
- Cache lookup traces

## Limitations & Considerations

### YC Platform Limits
- API Gateway: 10MB payload
- Functions: 10min timeout, 8GB memory
- Cold starts: 100-500ms typical

### Next.js Feature Support
- Streaming: Limited by API Gateway
- Middleware: Edge-emulated, not true isolates
- WebSockets: Not supported

### Cost Optimization
- Use prepared instances wisely
- Enable CDN for high-traffic apps
- Configure appropriate cache TTLs
- Monitor function memory usage

## Disaster Recovery

### Backup Strategy
- Static assets versioned in Object Storage
- YDB automatic backups
- Function code versioned
- Infrastructure as Code

### Recovery Procedures
1. **Rollback**: Switch to previous build
2. **Restore**: From Object Storage versions
3. **Rebuild**: From source + manifest

## Future Enhancements

### Planned Features
- WebSocket support via separate service
- Enhanced streaming capabilities
- Multi-region deployment
- A/B testing support

### Performance Improvements
- Function bundling optimization
- Smarter cache warming
- Predictive scaling
- Edge caching integration