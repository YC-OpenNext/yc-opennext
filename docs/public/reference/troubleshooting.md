# Troubleshooting Guide

Common issues and solutions when deploying Next.js applications with YC-OpenNext.

## Build Issues

### Error: "Next.js build directory (.next) not found"

**Cause:** The Next.js application hasn't been built before running YC-OpenNext.

**Solution:**
```bash
# Build Next.js first
npm run build

# Then run YC-OpenNext
yc-opennext build --project . --output ./yc-build
```

---

### Error: "Next.js not found in package.json dependencies"

**Cause:** Next.js is not installed or is in devDependencies.

**Solution:**
```bash
# Move Next.js to dependencies
npm install next react react-dom

# Verify package.json
cat package.json | grep '"next"'
```

---

### Error: "Incompatible Next.js version"

**Cause:** Using a Next.js version not supported by YC-OpenNext.

**Solution:**
```bash
# Check supported versions
yc-opennext analyze --project . --verbose

# Update Next.js to a supported version
npm install next@14
```

---

### Build Output Too Large

**Cause:** Bundle size exceeds Cloud Function limits.

**Solution:**

1. Enable standalone mode:
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
}
```

2. Optimize dependencies:
```bash
# Analyze bundle
npm run build -- --analyze

# Remove unused dependencies
npm prune --production
```

3. Use dynamic imports:
```javascript
// Instead of
import HeavyComponent from './HeavyComponent';

// Use
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

## Deployment Issues

### Error: "Access Denied" during upload

**Cause:** Invalid or missing AWS credentials for Object Storage.

**Solution:**
```bash
# Check credentials
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# Create new access keys
yc iam access-key create --service-account-name my-sa > keys.json
export AWS_ACCESS_KEY_ID=$(cat keys.json | jq -r .access_key.key_id)
export AWS_SECRET_ACCESS_KEY=$(cat keys.json | jq -r .secret)
```

---

### Error: "Bucket does not exist"

**Cause:** Object Storage bucket hasn't been created.

**Solution:**
```bash
# Create buckets
yc storage bucket create --name my-app-assets
yc storage bucket create --name my-app-cache

# Verify buckets exist
yc storage bucket list
```

---

### Terraform Error: "Provider not authenticated"

**Cause:** Yandex Cloud provider not configured.

**Solution:**
```bash
# Option 1: Use service account key
export YC_SERVICE_ACCOUNT_KEY_FILE=./sa-key.json

# Option 2: Use OAuth token
yc init
export YC_TOKEN=$(yc iam create-token)

# Verify in Terraform
terraform init
terraform plan
```

---

### API Gateway Returns 404

**Cause:** Routes not properly configured or function not deployed.

**Solution:**

1. Check function deployment:
```bash
yc serverless function list
yc serverless function version list --function-name my-app-server
```

2. Verify API Gateway spec:
```bash
yc api-gateway get --name my-app-gateway
```

3. Check routing in OpenAPI spec:
```yaml
paths:
  /{proxy+}:
    any:
      x-yc-apigateway-integration:
        type: cloud_functions
        function_id: ${function_id}  # Must be valid
```

## Runtime Issues

### Function Timeout

**Symptoms:** Function returns timeout error after 30 seconds.

**Solution:**

1. Increase timeout in Terraform:
```hcl
function_timeout = {
  server = 60  # Increase to 60 seconds
  image  = 30
}
```

2. Optimize slow operations:
```javascript
// Use caching for expensive operations
import { unstable_cache } from 'next/cache';

const getCachedData = unstable_cache(
  async () => fetchExpensiveData(),
  ['cache-key'],
  { revalidate: 3600 }
);
```

---

### Out of Memory Error

**Symptoms:** Function crashes with memory error.

**Solution:**

1. Increase memory allocation:
```hcl
function_memory = {
  server = 1024  # Increase to 1GB
  image  = 512
}
```

2. Profile memory usage:
```javascript
// Add memory logging
console.log('Memory usage:', process.memoryUsage());
```

3. Fix memory leaks:
```javascript
// Clear large objects when done
let largeData = await fetchData();
// Use data...
largeData = null; // Clear reference
```

---

### Cold Start Issues

**Symptoms:** First request takes several seconds.

**Solution:**

1. Enable prepared instances:
```hcl
prepared_instances = {
  server = 2  # Keep 2 warm instances
  image  = 1
}
```

2. Optimize initialization:
```javascript
// Lazy load heavy modules
let heavyModule;
function getHeavyModule() {
  if (!heavyModule) {
    heavyModule = require('heavy-module');
  }
  return heavyModule;
}
```

3. Use lightweight dependencies when possible.

## ISR & Caching Issues

### Pages Not Updating After Revalidation

**Cause:** Cache not properly invalidated or YDB connection issues.

**Solution:**

1. Check YDB connection:
```bash
# Verify YDB is accessible
yc ydb database get --name my-app-db

# Check tables exist
yc ydb table list --database-name my-app-db
```

2. Verify revalidation endpoint:
```bash
# Test revalidation
curl -X POST https://your-app.com/api/revalidate \
  -H "x-revalidate-signature: YOUR_SIGNATURE" \
  -d '{"type": "path", "value": "/blog/post-1"}'
```

3. Check cache bucket:
```bash
# List cached files
yc storage s3 ls s3://my-cache-bucket/cache/
```

---

### Tag Revalidation Not Working

**Cause:** Tags not properly stored in YDB or incorrect implementation.

**Solution:**

1. Verify tag storage:
```javascript
// Ensure tags are set during generation
export async function generateStaticParams() {
  return {
    props: { /* ... */ },
    tags: ['blog', 'tech'], // Add tags
  };
}
```

2. Check YDB tag table:
```bash
# Query tag mappings
yc ydb table query execute \
  --database /ru-central1/.../my-app-db \
  --query "SELECT * FROM isr_tags WHERE pk = 'tag#blog'"
```

## Middleware Issues

### Middleware Not Executing

**Cause:** Middleware file not in correct location or not properly configured.

**Solution:**

1. Check middleware location:
```bash
# Must be at root or src root
ls -la middleware.{js,ts}
ls -la src/middleware.{js,ts}
```

2. Verify middleware manifest:
```bash
# Check build output
cat .next/server/middleware-manifest.json
```

3. Check middleware matcher:
```javascript
// middleware.js
export const config = {
  matcher: [
    // Must match your routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

### Edge Runtime API Not Supported

**Symptoms:** "X is not defined" errors in middleware.

**Solution:**

1. Use supported APIs only:
```javascript
// ✅ Supported
Request, Response, Headers, URL, URLSearchParams, fetch

// ❌ Not supported (use alternatives)
// Edge-specific APIs like crypto.subtle may have limitations
```

2. Enable Node fallback mode:
```javascript
// Force Node.js mode if needed
export const config = {
  runtime: 'nodejs', // Instead of 'edge'
};
```

## Image Optimization Issues

### Images Not Loading

**Cause:** Image domain not configured or optimization function error.

**Solution:**

1. Configure image domains:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'images.example.com'],
    // Or use remotePatterns for more control
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
};
```

2. Check image function logs:
```bash
yc serverless function logs --name my-app-image-function
```

---

### Image Optimization Slow

**Solution:**

1. Enable image caching:
```javascript
// Use cache headers
<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero"
  priority // For LCP images
  placeholder="blur" // With blurDataURL
/>
```

2. Optimize source images:
```bash
# Pre-optimize images during build
npm install --save-dev @squoosh/cli
squoosh-cli --resize '{width:1920}' --webp '{quality:80}' ./public/images/*
```

## DNS & SSL Issues

### Custom Domain Not Working

**Solution:**

1. Verify DNS records:
```bash
# Check DNS propagation
dig your-domain.com
nslookup your-domain.com

# Get correct records from Terraform
terraform output name_servers
terraform output api_gateway_domain
```

2. Wait for propagation (up to 48 hours).

---

### SSL Certificate Validation Failed

**Solution:**

1. Check certificate status:
```bash
yc certificate-manager certificate get --name my-app-cert
```

2. Verify DNS validation records:
```bash
# Get validation records
yc certificate-manager certificate get --name my-app-cert \
  --format json | jq .challenges

# Add CNAME records to your DNS
```

## Performance Issues

### Slow Response Times

**Diagnosis:**
```bash
# Check function duration
yc serverless function list-operations --function-name my-app-server

# Monitor metrics
yc monitoring dashboard get --name my-app-dashboard
```

**Solutions:**

1. Enable CDN for static assets
2. Optimize database queries
3. Implement proper caching
4. Use prepared instances
5. Minimize bundle size

---

### High Costs

**Analysis:**
```bash
# Check usage
yc billing account get --id YOUR_BILLING_ACCOUNT_ID

# Function invocations
yc serverless function get --name my-app-server
```

**Optimization:**
1. Reduce function memory if overprovisioned
2. Implement aggressive caching
3. Use lifecycle policies for storage
4. Optimize image sizes
5. Consider reserved capacity

## Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Set debug environment variables
export DEBUG=yc-opennext:*
export LOG_LEVEL=debug

# In function environment
environment = {
  DEBUG = "yc-opennext:*"
  LOG_LEVEL = "debug"
}
```

## Getting Help

If you can't resolve an issue:

1. **Search existing issues:**
   ```bash
   https://github.com/yc-opennext/yc-opennext/issues
   ```

2. **Create a detailed bug report:**
   - YC-OpenNext version
   - Next.js version
   - Error messages
   - Relevant configuration
   - Steps to reproduce

3. **Join the community:**
   - [GitHub Discussions](https://github.com/yc-opennext/yc-opennext/discussions)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/yc-opennext)

## Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `ENOENT` | File not found | Check file paths and build output |
| `EACCES` | Permission denied | Check IAM roles and permissions |
| `ETIMEDOUT` | Operation timeout | Increase timeouts or optimize code |
| `ENOMEM` | Out of memory | Increase function memory |
| `ENOTFOUND` | DNS lookup failed | Check network and endpoints |
| `413` | Payload too large | Reduce request size or use streaming |
| `429` | Too many requests | Implement rate limiting or scaling |
| `500` | Internal server error | Check function logs for details |
| `502` | Bad gateway | Check function health and configuration |
| `503` | Service unavailable | Check quotas and limits |