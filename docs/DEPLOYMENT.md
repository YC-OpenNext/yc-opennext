# YC-OpenNext Deployment Guide

## Prerequisites

### Required Tools

- Node.js 18+ and pnpm 8+
- Terraform 1.5+
- Yandex Cloud CLI (`yc`)
- Git

### Yandex Cloud Setup

1. Create a YC account
2. Create a cloud and folder
3. Enable required services:
   - Cloud Functions
   - Object Storage
   - API Gateway
   - YDB
   - Certificate Manager
   - Lockbox
   - Cloud DNS (optional)

### Authentication

#### Option 1: Service Account Key

```bash
yc iam service-account create --name deploy-sa
yc iam key create --service-account-name deploy-sa --output key.json
export YC_SERVICE_ACCOUNT_KEY_FILE=./key.json
```

#### Option 2: User OAuth Token

```bash
yc init
export YC_TOKEN=$(yc iam create-token)
```

## Step-by-Step Deployment

### 1. Install YC-OpenNext CLI

```bash
npm install -g @yc-opennext/cli
# or
pnpm add -g @yc-opennext/cli
```

### 2. Prepare Your Next.js Application

Ensure your Next.js app is compatible:

```bash
# Check compatibility
yc-opennext analyze --project ./my-nextjs-app

# Update next.config.js for standalone
module.exports = {
  output: 'standalone',
  // ... other config
}
```

### 3. Build Your Application

```bash
# Build Next.js first
cd my-nextjs-app
npm run build

# Package for YC deployment
yc-opennext build \
  --project . \
  --output ../build \
  --standalone \
  --verbose
```

Output structure:

```
build/
├── artifacts/
│   ├── server.zip       # Server function bundle
│   ├── image.zip        # Image optimizer bundle
│   └── assets/          # Static files
├── deploy.manifest.json # Deployment descriptor
└── capabilities.json    # Detected features
```

### 4. Create S3 Buckets

```bash
# Create assets bucket
yc storage bucket create \
  --name my-app-assets \
  --default-storage-class standard \
  --max-size 10737418240

# Create cache bucket (for ISR)
yc storage bucket create \
  --name my-app-cache \
  --default-storage-class standard
```

### 5. Upload Artifacts

```bash
# Set S3 credentials
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key

# Upload to YC Object Storage
yc-opennext upload \
  --build-dir ./build \
  --bucket my-app-assets \
  --cache-bucket my-app-cache \
  --prefix v1 \
  --region ru-central1 \
  --verbose
```

### 6. Configure Terraform

Create `terraform.tfvars`:

```hcl
# terraform.tfvars
cloud_id    = "b1g8..."
folder_id   = "b1g9..."
domain_name = "app.example.com"

app_name      = "my-nextjs-app"
env           = "production"
build_id      = "v1"
manifest_path = "../build/deploy.manifest.json"

enable_isr = true
enable_cdn = true

function_memory = {
  server = 1024
  image  = 512
}

prepared_instances = {
  server = 1
  image  = 0
}
```

### 7. Initialize Terraform

```bash
cd terraform/envs/prod

# Initialize providers
terraform init

# Review plan
terraform plan -var-file=terraform.tfvars

# Apply configuration
terraform apply -var-file=terraform.tfvars
```

### 8. Configure DNS

After Terraform completes:

```bash
# Get name servers
terraform output name_servers

# Update your domain's NS records at your registrar
```

### 9. Verify Deployment

```bash
# Check function logs
yc serverless function logs \
  --name my-nextjs-app-prod-server-function \
  --follow

# Test endpoints
curl https://app.example.com
curl https://app.example.com/api/hello

# Check metrics
yc monitoring dashboard get --name my-app-dashboard
```

## Deployment Patterns

### Development Environment

Fast iteration with minimal resources:

```bash
# Quick deploy for dev
yc-opennext build --project . --output ./build --skip-build

terraform apply -var="env=dev" \
  -var="prepared_instances.server=0" \
  -var="enable_cdn=false"
```

### Production Environment

High availability with optimizations:

```bash
# Production build
NODE_ENV=production npm run build
yc-opennext build --project . --output ./build --standalone

# Deploy with production settings
terraform apply -var-file=prod.tfvars \
  -var="prepared_instances.server=2" \
  -var="enable_cdn=true" \
  -var="cache_ttl_days=30"
```

### Staging Environment

Production-like with cost optimization:

```bash
terraform apply -var="env=staging" \
  -var="prepared_instances.server=1" \
  -var="function_memory.server=512"
```

## Blue-Green Deployment

### Deploy New Version

```bash
# 1. Build new version
yc-opennext build --project . --output ./build-v2 --build-id v2

# 2. Upload new artifacts
yc-opennext upload --build-dir ./build-v2 --bucket my-app-assets --prefix v2

# 3. Deploy new version
terraform apply -var="build_id=v2"
```

### Rollback

```bash
# Simply redeploy previous version
terraform apply -var="build_id=v1"
```

### Canary Deployment

Use API Gateway weighted routing (manual setup):

```yaml
paths:
  /{proxy+}:
    x-yc-apigateway-integration:
      type: cloud_functions
      function_id: ${function_id}
      service_account_id: ${sa_id}
      weighted:
        - weight: 90
          function_version_id: ${v1_version}
        - weight: 10
          function_version_id: ${v2_version}
```

## Monitoring Deployment

### Health Checks

```bash
# Function health
curl https://app.example.com/api/health

# Check function metrics
yc serverless function get --name my-app-server-function
```

### Performance Metrics

```bash
# Function execution time
yc monitoring metrics get \
  --service=serverless.functions \
  --name=function.executions_duration_milliseconds \
  --labels="function_id=xxx"

# Cache hit rate (custom metrics)
yc monitoring metrics get \
  --service=custom \
  --name=cache_hit_rate
```

## Troubleshooting

### Common Issues

#### 1. Function Timeout

```bash
# Increase timeout
terraform apply -var="function_timeout.server=120"
```

#### 2. Cold Starts

```bash
# Add prepared instances
terraform apply -var="prepared_instances.server=2"
```

#### 3. Memory Issues

```bash
# Increase memory
terraform apply -var="function_memory.server=2048"
```

#### 4. Cache Misses

```bash
# Check cache configuration
yc storage bucket get --name my-app-cache

# Verify YDB tables
yc ydb database get --name my-app-ydb
```

### Debug Mode

Enable detailed logging:

```javascript
// Set in function environment
DEBUG=yc-opennext:*
LOG_LEVEL=debug
```

### Support

- GitHub Issues: https://github.com/yc-opennext/yc-opennext/issues
- Documentation: https://yc-opennext.dev/docs
- YC Support: https://cloud.yandex.com/support
