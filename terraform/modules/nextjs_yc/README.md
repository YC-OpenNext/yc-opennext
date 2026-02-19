# Next.js YC Module

Main Terraform module for deploying Next.js applications to Yandex Cloud.

## Features

- Blue-green deployments with versioned artifacts
- Automatic SSL/TLS certificate provisioning
- ISR with YDB DocAPI backend
- Image optimization function
- Middleware support
- Object Storage for static assets
- API Gateway routing
- Comprehensive security with KMS and Lockbox

## Usage

```hcl
module "nextjs_app" {
  source = "./modules/nextjs_yc"

  # Required
  app_name      = "my-nextjs-app"
  env           = "production"
  cloud_id      = "b1g..."
  folder_id     = "b1g..."
  domain_name   = "app.example.com"
  build_id      = "build-20240101-abc123"
  manifest_path = "./build/deploy.manifest.json"

  # Optional
  enable_isr     = true
  enable_cdn     = false
  cache_ttl_days = 30

  # Function configuration
  function_memory = {
    server = 512
    image  = 256
  }

  function_timeout = {
    server = 30
    image  = 30
  }

  prepared_instances = {
    server = 1
    image  = 0
  }

  # CORS
  allowed_origins = ["https://app.example.com"]

  # Tags
  tags = {
    team = "platform"
    cost_center = "engineering"
  }
}
```

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|----------|
| app_name | Application name | string | - | yes |
| env | Environment (dev, staging, production) | string | - | yes |
| cloud_id | Yandex Cloud ID | string | - | yes |
| folder_id | Yandex Cloud Folder ID | string | - | yes |
| domain_name | Custom domain | string | - | yes |
| build_id | Build identifier | string | - | yes |
| manifest_path | Path to deployment manifest | string | - | yes |
| enable_isr | Enable ISR | bool | true | no |
| enable_cdn | Enable CDN | bool | false | no |
| cache_ttl_days | Cache TTL in days | number | 30 | no |

## Outputs

| Name | Description |
|------|-------------|
| api_gateway_domain | API Gateway domain |
| custom_domain | Custom domain name |
| assets_bucket | Assets bucket name |
| server_function_id | Server function ID |
| deployment_info | Deployment metadata |

## Deployment Flow

1. Build artifacts with yc-opennext CLI
2. Upload to Object Storage
3. Apply Terraform with new build_id
4. Verify deployment
5. Update DNS if needed

## Rollback

To rollback to a previous version:

```bash
terraform apply -var="build_id=previous-build-id"
```

## Monitoring

View function logs:
```bash
yc serverless function logs --name my-app-prod-server-function --follow
```

View metrics in YC Console.