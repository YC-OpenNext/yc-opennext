# Quick Start Guide

Deploy your Next.js application to Yandex Cloud in 5 minutes.

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+ and npm/pnpm installed
- ✅ A Yandex Cloud account ([sign up here](https://cloud.yandex.com))
- ✅ Yandex Cloud CLI installed ([installation guide](https://cloud.yandex.com/docs/cli/quickstart))
- ✅ A Next.js application ready to deploy

## Step 1: Install YC-OpenNext

```bash
npm install -g @yc-opennext/cli
```

Or add to your project:

```bash
npm install --save-dev @yc-opennext/cli
```

## Step 2: Configure Yandex Cloud

### Authenticate with YC

```bash
# Initialize YC CLI
yc init

# Create a service account for deployment
yc iam service-account create --name yc-opennext-deploy

# Create access keys
yc iam access-key create --service-account-name yc-opennext-deploy > keys.json

# Export credentials
export AWS_ACCESS_KEY_ID=$(cat keys.json | jq -r .access_key.key_id)
export AWS_SECRET_ACCESS_KEY=$(cat keys.json | jq -r .secret)
```

### Get your Cloud and Folder IDs

```bash
# List your clouds
yc resource-manager cloud list

# List folders in your cloud
yc resource-manager folder list --cloud-id <your-cloud-id>

# Export for later use
export YC_CLOUD_ID=<your-cloud-id>
export YC_FOLDER_ID=<your-folder-id>
```

## Step 3: Prepare Your Next.js App

### Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone mode for optimal deployment
  output: 'standalone',

  // Configure image optimization
  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
```

### Build your application

```bash
# In your Next.js project directory
npm run build
```

## Step 4: Package for Deployment

```bash
# Analyze and build for YC
yc-opennext build \
  --project . \
  --output ./yc-build \
  --standalone \
  --verbose

# Check the output
ls -la ./yc-build/
# You should see:
# - artifacts/      (function packages)
# - deploy.manifest.json (deployment config)
# - capabilities.json (detected features)
```

## Step 5: Create Storage Buckets

```bash
# Create bucket for static assets
yc storage bucket create \
  --name my-app-assets-$RANDOM \
  --default-storage-class standard

# Create bucket for cache (if using ISR)
yc storage bucket create \
  --name my-app-cache-$RANDOM \
  --default-storage-class standard

# Save bucket names
export ASSETS_BUCKET=my-app-assets-xxxxx
export CACHE_BUCKET=my-app-cache-xxxxx
```

## Step 6: Upload Artifacts

```bash
yc-opennext upload \
  --build-dir ./yc-build \
  --bucket $ASSETS_BUCKET \
  --cache-bucket $CACHE_BUCKET \
  --prefix v1 \
  --region ru-central1
```

## Step 7: Deploy with Terraform

### Create Terraform configuration

Create a file `deploy.tf`:

```hcl
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.100.0"
    }
  }
}

provider "yandex" {
  cloud_id  = var.cloud_id
  folder_id = var.folder_id
}

module "nextjs_app" {
  source = "github.com/yc-opennext/yc-opennext//terraform/modules/nextjs_yc"

  app_name      = "my-nextjs-app"
  env           = "production"
  cloud_id      = var.cloud_id
  folder_id     = var.folder_id
  domain_name   = "app.example.com"  # Change to your domain
  build_id      = "v1"
  manifest_path = "./yc-build/deploy.manifest.json"
}

variable "cloud_id" {
  default = "YOUR_CLOUD_ID"
}

variable "folder_id" {
  default = "YOUR_FOLDER_ID"
}

output "app_url" {
  value = module.nextjs_app.api_gateway_domain
}
```

### Deploy the infrastructure

```bash
# Initialize Terraform
terraform init

# Review the deployment plan
terraform plan

# Apply the configuration
terraform apply -auto-approve

# Get your app URL
terraform output app_url
```

## Step 8: Access Your Application

Your application is now live! Access it at the API Gateway domain shown in the Terraform output.

To use a custom domain, update the DNS records as shown in the Terraform output.

## 🎉 Congratulations!

You've successfully deployed your Next.js application to Yandex Cloud!

### What's Next?

- [Configure a custom domain](../guides/custom-domain.md)
- [Set up CI/CD](../guides/cicd-integration.md)
- [Optimize for production](../guides/production-best-practices.md)
- [Monitor your application](../guides/monitoring.md)

## Quick Commands Reference

```bash
# Build and deploy a new version
yc-opennext build --project . --output ./build-v2
yc-opennext upload --build-dir ./build-v2 --bucket $ASSETS_BUCKET --prefix v2
terraform apply -var="build_id=v2"

# Rollback to previous version
terraform apply -var="build_id=v1"

# View function logs
yc serverless function logs --name my-nextjs-app-production-server-function --follow

# Check deployment status
terraform show
```

## Troubleshooting

If you encounter issues:

1. **Build fails**: Ensure your Next.js app builds locally with `npm run build`
2. **Upload fails**: Check your AWS credentials are set correctly
3. **Terraform fails**: Verify your YC cloud and folder IDs
4. **Function errors**: Check logs with `yc serverless function logs`

For more help, see our [troubleshooting guide](../reference/troubleshooting.md).