# YC-OpenNext Terraform Modules

Infrastructure as Code for deploying Next.js applications to Yandex Cloud.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         API Gateway                         │
│                    (Custom Domain + TLS)                    │
└─────────────────┬───────────────────────────┬──────────────┘
                  │                           │
        ┌─────────▼─────────┐       ┌────────▼────────┐
        │  Cloud Functions  │       │ Object Storage  │
        │  - Server (SSR)   │       │  - Static Assets│
        │  - Image Optimizer│       │  - ISR Cache    │
        └───────────────────┘       └─────────────────┘
                  │
        ┌─────────▼─────────┐
        │   YDB DocAPI      │
        │  - ISR Metadata   │
        │  - Tags/Paths     │
        └───────────────────┘
```

## Modules

### nextjs_yc

Main module for deploying a Next.js application.

### core_security

Security components: KMS, Lockbox, IAM roles.

### ydb_docapi

YDB serverless database with DynamoDB-compatible API.

## Quick Start

```hcl
# main.tf
module "nextjs_app" {
  source = "./modules/nextjs_yc"

  env         = "production"
  app_name    = "my-nextjs-app"
  cloud_id    = var.cloud_id
  folder_id   = var.folder_id
  region      = "ru-central1"

  domain_name    = "app.example.com"
  build_id       = "build-12345"
  manifest_path  = "./build/deploy.manifest.json"

  enable_isr = true
  enable_cdn = true
}
```

## Deployment Process

1. **Build**: Create Next.js artifacts using yc-opennext CLI
2. **Upload**: Push artifacts to Object Storage
3. **Apply**: Deploy infrastructure with Terraform
4. **Verify**: Test the deployment
5. **Rollback**: If needed, revert to previous build_id

## Blue-Green Deployments

Every deployment creates versioned, immutable resources:

```bash
# Deploy new version
terraform apply -var="build_id=v2"

# Rollback if needed
terraform apply -var="build_id=v1"
```

## Environment Configuration

### Development

```bash
cd envs/dev
terraform init
terraform apply -var-file="terraform.tfvars"
```

### Production

```bash
cd envs/prod
terraform init
terraform apply -var-file="terraform.tfvars"
```

## Resource Naming Convention

All resources follow the pattern: `{app_name}-{env}-{resource_type}-{suffix}`

Examples:

- `myapp-prod-server-function`
- `myapp-prod-assets-bucket`
- `myapp-prod-api-gateway`

## Security Best Practices

1. **Secrets**: Stored in Lockbox, never in outputs
2. **Encryption**: All storage encrypted with KMS
3. **Access**: Private by default, explicit public endpoints
4. **TLS**: Enforced for all connections
5. **IAM**: Least privilege principle

## Cost Optimization

- Use prepared instances for predictable traffic
- Enable CDN for static assets
- Configure appropriate function memory/timeout
- Set lifecycle policies for cache storage
- Use YDB on-demand pricing

## Monitoring

Resources are tagged for monitoring:

- `app`: Application name
- `env`: Environment
- `build_id`: Build identifier
- `managed_by`: "terraform"

## Troubleshooting

### Function Logs

```bash
yc serverless function logs --name myapp-prod-server-function
```

### API Gateway Logs

Check CloudWatch-compatible logs in YC Console.

### Storage Metrics

Monitor via YC Console or API.

## Module Inputs

See individual module READMEs for detailed input/output documentation:

- [nextjs_yc](./modules/nextjs_yc/README.md)
- [core_security](./modules/core_security/README.md)
- [ydb_docapi](./modules/ydb_docapi/README.md)
