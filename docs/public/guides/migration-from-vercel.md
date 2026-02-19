# Migration Guide: From Vercel to YC-OpenNext

Comprehensive guide for migrating your Next.js application from Vercel to Yandex Cloud using YC-OpenNext.

## Overview

YC-OpenNext provides Vercel-like functionality on Yandex Cloud with these key differences:

| Feature            | Vercel           | YC-OpenNext            |
| ------------------ | ---------------- | ---------------------- |
| **Deployment**     | Git-based        | CLI/Terraform          |
| **Edge Functions** | V8 Isolates      | Node.js with polyfills |
| **Analytics**      | Built-in         | Custom implementation  |
| **Preview URLs**   | Automatic        | Manual setup           |
| **Global CDN**     | Included         | Optional YC CDN        |
| **Pricing**        | Per-seat + usage | Pay-as-you-go          |

## Pre-Migration Checklist

Before migrating, ensure you have:

- [ ] Exported environment variables from Vercel
- [ ] Documented custom headers and redirects
- [ ] Listed all domains and subdomains
- [ ] Backed up any Vercel-specific configurations
- [ ] Reviewed function regions and requirements
- [ ] Checked for Vercel-specific API usage

## Step 1: Export from Vercel

### Export Environment Variables

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull .env.production

# List all environment variables
vercel env ls
```

### Export Project Settings

```bash
# Get project configuration
vercel project ls
vercel project <project-name> --json > vercel-config.json

# Download current deployment
vercel pull
```

## Step 2: Prepare Your Next.js Application

### Update Configuration

#### vercel.json → yc-opennext.config.js

**Before (vercel.json):**

```json
{
  "functions": {
    "pages/api/hello.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

**After (next.config.js):**

```javascript
module.exports = {
  output: 'standalone',

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },
};
```

### Environment Variables

Create `.env.production` for YC-OpenNext:

```bash
# Vercel System Variables → YC Equivalents
NEXT_PUBLIC_VERCEL_URL → NEXT_PUBLIC_APP_URL
VERCEL_ENV → NODE_ENV
VERCEL_REGION → YC_REGION

# Add YC-specific variables
YC_CLOUD_ID=your-cloud-id
YC_FOLDER_ID=your-folder-id
BUILD_ID=your-build-id
```

### Update API Routes

#### Vercel-specific APIs

Replace Vercel-specific imports:

**Before:**

```javascript
// pages/api/og.js
import { ImageResponse } from '@vercel/og';

export default function handler() {
  return new ImageResponse(/* ... */);
}
```

**After:**

```javascript
// pages/api/og.js
import { ImageResponse } from '@yc-opennext/og-image';
// Or use alternative like @napi-rs/canvas

export default function handler() {
  // Implement OG image generation
}
```

#### Edge Runtime → Node.js

**Before:**

```javascript
// pages/api/edge.js
export const config = {
  runtime: 'edge',
};

export default function handler(request) {
  return new Response('Hello from Edge!');
}
```

**After:**

```javascript
// pages/api/edge.js
// No edge runtime config needed
import { NextResponse } from 'next/server';

export default function handler(request) {
  return NextResponse.json({ message: 'Hello from YC!' });
}
```

## Step 3: Build and Test Locally

### Verify Compatibility

```bash
# Analyze your application
yc-opennext analyze --project . --strict

# Review compatibility report
cat ./capabilities.json
```

### Test Build

```bash
# Build for YC
yc-opennext build \
  --project . \
  --output ./yc-build \
  --standalone

# Check build artifacts
ls -la ./yc-build/artifacts/
```

## Step 4: Set Up Yandex Cloud Infrastructure

### Create Required Resources

```bash
# Create Object Storage buckets
yc storage bucket create --name my-app-assets
yc storage bucket create --name my-app-cache

# Create service account
yc iam service-account create --name my-app-sa

# Create YDB database (for ISR)
yc ydb database create --name my-app-db --serverless
```

### Configure Terraform

Create `terraform/main.tf`:

```hcl
module "nextjs_app" {
  source = "github.com/yc-opennext/yc-opennext//terraform/modules/nextjs_yc"

  app_name      = "my-vercel-app"
  env           = "production"
  cloud_id      = var.cloud_id
  folder_id     = var.folder_id
  domain_name   = "app.example.com"

  # Match Vercel function configuration
  function_memory = {
    server = 1024  # Match Vercel's function size
    image  = 512
  }

  function_timeout = {
    server = 10    # Match Vercel's maxDuration
    image  = 10
  }

  # Enable features you were using on Vercel
  enable_isr = true
  enable_cdn = true  # Replaces Vercel's global CDN
}
```

## Step 5: Migrate Domains

### DNS Migration

1. **Note current Vercel DNS settings:**

```bash
# Get current DNS records
dig app.example.com
dig www.app.example.com
```

2. **Update DNS to point to YC:**

```bash
# After deploying to YC, get the API Gateway domain
terraform output api_gateway_domain

# Update your DNS:
# A/CNAME app.example.com → <api-gateway-domain>
```

3. **SSL Certificates:**
   YC-OpenNext automatically provisions certificates via Certificate Manager.

## Step 6: Deploy to YC

### Initial Deployment

```bash
# Upload artifacts
yc-opennext upload \
  --build-dir ./yc-build \
  --bucket my-app-assets \
  --prefix v1

# Deploy infrastructure
cd terraform
terraform init
terraform apply -var="build_id=v1"
```

### Verify Deployment

```bash
# Get application URL
terraform output app_url

# Test endpoints
curl https://<api-gateway-domain>
curl https://<api-gateway-domain>/api/hello

# Check function logs
yc serverless function logs --name my-app-production-server-function
```

## Step 7: Migrate CI/CD

### From Vercel GitHub Integration

**Before (Vercel):** Automatic deployments on push

**After (GitHub Actions):**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to YC

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Package for YC
        run: |
          npx yc-opennext build \
            --project . \
            --output ./yc-build \
            --build-id ${{ github.sha }}

      - name: Upload to YC
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.YC_ACCESS_KEY }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.YC_SECRET_KEY }}
        run: |
          npx yc-opennext upload \
            --build-dir ./yc-build \
            --bucket ${{ vars.ASSETS_BUCKET }} \
            --prefix ${{ github.sha }}

      - name: Deploy with Terraform
        env:
          YC_TOKEN: ${{ secrets.YC_TOKEN }}
        run: |
          cd terraform
          terraform init
          terraform apply \
            -var="build_id=${{ github.sha }}" \
            -auto-approve
```

## Feature-Specific Migration

### Incremental Static Regeneration (ISR)

Vercel ISR → YC ISR works the same way:

```javascript
// pages/blog/[slug].js or app/blog/[slug]/page.js
export async function getStaticProps() {
  return {
    props: {
      /* ... */
    },
    revalidate: 60, // Works identically
  };
}
```

### Image Optimization

```javascript
// No changes required for basic usage
import Image from 'next/image';

<Image src="/hero.jpg" width={1200} height={600} alt="Hero" />;
```

### Middleware

```javascript
// middleware.js works but runs in Node.js, not Edge Runtime
export function middleware(request) {
  // Some Vercel Edge APIs might need adjustment
  const response = NextResponse.next();
  response.headers.set('x-custom', 'header');
  return response;
}
```

### Analytics

Vercel Analytics requires replacement:

```javascript
// Remove Vercel Analytics
// import { Analytics } from '@vercel/analytics/react';

// Add your preferred analytics
import { GoogleAnalytics } from '@next/third-parties/google';
```

## Common Migration Issues

### Issue 1: Edge Runtime Functions

**Problem:** Functions using Edge Runtime don't work.

**Solution:** Remove `runtime: 'edge'` config. Functions run in Node.js on YC.

### Issue 2: Vercel KV/Postgres

**Problem:** Using Vercel's managed databases.

**Solution:**

- Replace Vercel KV with YDB or Redis
- Replace Vercel Postgres with YDB or Managed PostgreSQL

### Issue 3: Preview Deployments

**Problem:** No automatic preview deployments.

**Solution:** Set up multiple environments:

```bash
# Deploy preview
terraform workspace new preview
terraform apply -var="env=preview" -var="build_id=pr-123"
```

### Issue 4: Cron Jobs

**Problem:** Vercel cron jobs need replacement.

**Solution:** Use YC Cloud Functions with triggers:

```javascript
// Create a separate function for cron
export async function cronHandler() {
  // Your cron logic
}
```

## Performance Comparison

| Metric            | Vercel      | YC-OpenNext | Notes                  |
| ----------------- | ----------- | ----------- | ---------------------- |
| **Cold Start**    | 50-250ms    | 100-500ms   | Use prepared instances |
| **Warm Response** | 10-50ms     | 10-50ms     | Comparable             |
| **Build Time**    | 1-3 min     | 2-4 min     | Depends on app size    |
| **Deploy Time**   | 30-60s      | 60-120s     | Terraform apply time   |
| **Max Timeout**   | 5 min (Pro) | 10 min      | YC has higher limit    |
| **Max Payload**   | 4.5MB       | 10MB        | YC has higher limit    |

## Cost Comparison

Rough monthly estimates for a typical app:

**Vercel Pro ($20/user + usage):**

- Team of 3: $60
- 1M requests: $40
- Bandwidth: $40
- **Total: ~$140/month**

**YC-OpenNext (pay-as-you-go):**

- Functions: $20
- Storage: $5
- API Gateway: $10
- YDB: $15
- **Total: ~$50/month**

## Rollback Plan

If you need to rollback to Vercel:

1. Keep Vercel project paused (not deleted)
2. Update DNS back to Vercel
3. Redeploy latest version on Vercel
4. Migrate environment variables back

## Post-Migration Checklist

- [ ] All pages load correctly
- [ ] API routes respond
- [ ] Images optimize properly
- [ ] ISR pages revalidate
- [ ] Middleware executes
- [ ] Forms submit successfully
- [ ] Authentication works
- [ ] Payment processing works
- [ ] Analytics tracking works
- [ ] SEO meta tags present
- [ ] Sitemap accessible
- [ ] Robots.txt served
- [ ] Custom headers applied
- [ ] Redirects working
- [ ] 404 page displays
- [ ] Error handling works

## Getting Support

- **Documentation**: [YC-OpenNext Docs](../README.md)
- **GitHub Issues**: [Report problems](https://github.com/yc-opennext/yc-opennext/issues)
- **Community**: [Discussions](https://github.com/yc-opennext/yc-opennext/discussions)
- **Vercel Migration Help**: Tag issues with `migration-from-vercel`

## Summary

Migrating from Vercel to YC-OpenNext involves:

1. **Configuration changes**: Update configs for YC compatibility
2. **Build process**: Use YC-OpenNext CLI instead of Vercel CLI
3. **Infrastructure**: Provision YC resources with Terraform
4. **CI/CD**: Replace Vercel's Git integration with GitHub Actions
5. **Monitoring**: Set up custom monitoring/analytics

Most Next.js features work identically, with the main differences being in edge runtime support and deployment process.
