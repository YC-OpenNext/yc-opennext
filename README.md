# YC-OpenNext

<div align="center">
  <img src="https://yc-opennext.github.io/yc-opennext/favicon.svg" alt="YC-OpenNext Logo" width="100" height="100">

  **Terraform Module for Deploying Next.js on Yandex Cloud**

  [![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://yc-opennext.github.io/yc-opennext)
  [![Terraform](https://img.shields.io/badge/terraform-%3E%3D1.5-purple)](https://www.terraform.io/)
  [![Next.js](https://img.shields.io/badge/Next.js-12--15-black)](https://nextjs.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

## 📖 Documentation

Full documentation is available at **[yc-opennext.github.io/yc-opennext](https://yc-opennext.github.io/yc-opennext)**

## 🚀 Quick Start

Deploy your Next.js application to Yandex Cloud in minutes using our Terraform module:

### 1. Create Terraform Configuration

Create a `main.tf` file in your project:

```hcl
module "nextjs" {
  source = "github.com/yc-opennext/yc-opennext//terraform/modules/nextjs_yc"

  # Basic configuration
  app_name     = "my-nextjs-app"
  environment  = "production"

  # Yandex Cloud settings
  folder_id    = var.yc_folder_id
  zone         = "ru-central1-a"

  # Next.js build output
  build_output_path = "./build"

  # Features
  enable_isr = true
  enable_cdn = true
}

# Outputs
output "app_url" {
  value = module.nextjs.app_url
}

output "api_gateway_domain" {
  value = module.nextjs.api_gateway_domain
}
```

### 2. Install from GitHub Packages (Optional)

For the latest development version:

```bash
# Configure npm to use GitHub Packages for @yc-opennext scope
npm config set @yc-opennext:registry https://npm.pkg.github.com

# Install packages
npm install @yc-opennext/cli
npm install @yc-opennext/runtime
```

### 3. Prepare Your Next.js App

Configure `next.config.js`:

```javascript
module.exports = {
  output: 'standalone',

  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### 4. Build and Deploy

```bash
# Build your Next.js app
npm run build

# Initialize Terraform
terraform init

# Deploy to Yandex Cloud
terraform apply

# Your app is now live! 🎉
```

## 📦 Complete Example

```hcl
# versions.tf
terraform {
  required_version = ">= 1.5"

  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.100"
    }
  }
}

# main.tf
module "nextjs" {
  source = "github.com/yc-opennext/yc-opennext//terraform/modules/nextjs_yc"

  app_name     = "my-store"
  environment  = "production"
  folder_id    = "b1g123456789"

  # Domain configuration
  domain_name  = "store.example.com"

  # Scaling
  function_memory  = 512
  function_timeout = 30
  min_instances    = 0
  max_instances    = 100

  # Features
  enable_isr        = true
  enable_cdn        = true
  enable_monitoring = true

  # Build settings
  build_output_path = "./build"
  node_version      = "18"

  tags = {
    Team    = "Frontend"
    Project = "E-commerce"
  }
}

# outputs.tf
output "app_url" {
  value = module.nextjs.app_url
  description = "The URL of your Next.js application"
}

output "cloudfront_distribution_id" {
  value = module.nextjs.cdn_distribution_id
  description = "CDN distribution ID for cache invalidation"
}
```

## 🔧 Module Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `app_name` | Application name | `"my-app"` |
| `environment` | Environment (dev/staging/prod) | `"production"` |
| `folder_id` | Yandex Cloud folder ID | `"b1g..."` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `domain_name` | Custom domain | `null` |
| `enable_isr` | Enable ISR support | `true` |
| `enable_cdn` | Enable CDN | `true` |
| `function_memory` | Memory for functions (MB) | `512` |
| `function_timeout` | Timeout (seconds) | `30` |
| `node_version` | Node.js version | `"18"` |

## 🌟 Features

- ✅ **Full Next.js 12-15 Support** - Pages Router, App Router, API Routes
- ✅ **Incremental Static Regeneration** - With YDB caching
- ✅ **Image Optimization** - On-demand with Sharp
- ✅ **Middleware Support** - Edge-compatible execution
- ✅ **Blue-Green Deployments** - Zero downtime updates
- ✅ **Auto-scaling** - Handle any traffic load
- ✅ **Custom Domains** - With SSL certificates
- ✅ **Monitoring** - Built-in metrics and logging

## 📊 Cost Comparison

| Provider | Monthly Cost* | Setup Time |
|----------|--------------|------------|
| Vercel Pro | $20 + usage | 5 min |
| YC-OpenNext | ~$7 + usage | 15 min |
| Self-hosted | $50+ | Hours |

*For typical Next.js app with ~100k requests/month

## 🛠️ Advanced Configuration

### Using with CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Yandex Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npm run build

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2

      - name: Deploy with Terraform
        env:
          YC_TOKEN: ${{ secrets.YC_TOKEN }}
        run: |
          terraform init
          terraform apply -auto-approve
```

### Multi-Environment Setup

```hcl
# environments/dev/main.tf
module "nextjs_dev" {
  source = "../../terraform/modules/nextjs_yc"

  app_name     = "my-app-dev"
  environment  = "development"

  # Lower resources for dev
  function_memory = 256
  enable_cdn      = false
}

# environments/prod/main.tf
module "nextjs_prod" {
  source = "../../terraform/modules/nextjs_yc"

  app_name     = "my-app"
  environment  = "production"

  # Production configuration
  function_memory  = 1024
  enable_cdn       = true
  enable_monitoring = true
  min_instances    = 1
}
```

## 📚 Examples

### E-commerce Store
```hcl
module "store" {
  source = "github.com/yc-opennext/yc-opennext//terraform/modules/nextjs_yc"

  app_name = "my-store"

  # High performance for product pages
  function_memory = 1024
  enable_isr      = true
  isr_revalidate  = 60  # Revalidate every minute

  # Image optimization for products
  image_optimization = {
    domains = ["cdn.mystore.com"]
    formats = ["image/avif", "image/webp"]
    sizes   = [640, 750, 828, 1080, 1200]
  }
}
```

### Blog with ISR
```hcl
module "blog" {
  source = "github.com/yc-opennext/yc-opennext//terraform/modules/nextjs_yc"

  app_name = "my-blog"

  # ISR for blog posts
  enable_isr     = true
  isr_revalidate = 3600  # Revalidate hourly

  # Lower resources for blog
  function_memory = 256
}
```

### SaaS Application
```hcl
module "saas" {
  source = "github.com/yc-opennext/yc-opennext//terraform/modules/nextjs_yc"

  app_name = "my-saas"

  # High availability
  min_instances = 2
  max_instances = 100

  # API-heavy workload
  function_memory  = 2048
  function_timeout = 60

  # Security
  enable_waf = true
  allowed_ips = ["1.2.3.4/32"]
}
```

## 🚨 Troubleshooting

### Common Issues

**Build fails with "Module not found"**
```bash
# Ensure standalone output is enabled
echo 'module.exports = { output: "standalone" }' >> next.config.js
```

**Function timeouts**
```hcl
# Increase timeout in Terraform
function_timeout = 60  # up to 600 seconds
```

**Cold starts are slow**
```hcl
# Keep functions warm
min_instances = 1
```

## 🔗 Resources

- 📖 [Full Documentation](https://yc-opennext.github.io/yc-opennext)
- 📦 [Terraform Registry](https://registry.terraform.io/modules/yc-opennext/nextjs/yandex)
- 🎯 [Example Projects](https://github.com/yc-opennext/examples)
- 💬 [Discord Community](https://discord.gg/yc-opennext)
- 🐛 [Report Issues](https://github.com/yc-opennext/yc-opennext/issues)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

  **Deploy Next.js to Yandex Cloud in minutes, not hours**

  [Get Started](https://yc-opennext.github.io/yc-opennext) • [Examples](https://github.com/yc-opennext/examples) • [Support](https://github.com/yc-opennext/yc-opennext/issues)

</div>