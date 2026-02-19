terraform {
  required_version = ">= 1.5.0"

  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.100.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }

    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
  }
}

# Load deployment manifest
locals {
  manifest = jsondecode(file(var.manifest_path))

  # Resource naming
  prefix = "${var.app_name}-${var.env}"

  # Common tags
  common_tags = {
    app        = var.app_name
    env        = var.env
    build_id   = var.build_id
    managed_by = "terraform"
  }
}

# ============================================================================
# Security Module
# ============================================================================

module "security" {
  source = "../core_security"

  app_name = var.app_name
  env      = var.env
  tags     = local.common_tags
}

# ============================================================================
# Storage Resources
# ============================================================================

# Assets bucket for static files
resource "yandex_storage_bucket" "assets" {
  bucket = "${local.prefix}-assets-${random_id.bucket_suffix.hex}"

  # Encryption
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = module.security.kms_key_id
        sse_algorithm     = "aws:kms"
      }
    }
  }

  # Versioning for rollback capability
  versioning {
    enabled = true
  }

  # CORS for Next.js assets
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = var.allowed_origins
    max_age_seconds = 3600
  }

  # Lifecycle rules for old versions
  lifecycle_rule {
    enabled = true
    id      = "cleanup-old-versions"

    noncurrent_version_expiration {
      days = 30
    }
  }

  # Access control
  acl = "private"

  # Force HTTPS
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Deny"
        Principal = "*"
        Action = "s3:*"
        Resource = [
          "arn:aws:s3:::${local.prefix}-assets-${random_id.bucket_suffix.hex}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })

  tags = local.common_tags
}

# Cache bucket for ISR
resource "yandex_storage_bucket" "cache" {
  count = var.enable_isr ? 1 : 0

  bucket = "${local.prefix}-cache-${random_id.bucket_suffix.hex}"

  # Encryption
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = module.security.kms_key_id
        sse_algorithm     = "aws:kms"
      }
    }
  }

  versioning {
    enabled = true
  }

  # Lifecycle for cache expiry
  lifecycle_rule {
    enabled = true
    id      = "expire-cache"

    expiration {
      days = var.cache_ttl_days
    }

    transition {
      days          = 7
      storage_class = "COLD"
    }
  }

  acl = "private"

  tags = local.common_tags
}

# ============================================================================
# YDB DocAPI for ISR Metadata
# ============================================================================

module "ydb_docapi" {
  count = var.enable_isr ? 1 : 0

  source = "../ydb_docapi"

  app_name = var.app_name
  env      = var.env

  # ISR tables configuration
  tables = {
    isr_entries = {
      hash_key = "pk"
      range_key = "sk"
      ttl_attribute = "ttl"
    }
    isr_tags = {
      hash_key = "pk"
      range_key = "sk"
      ttl_attribute = "ttl"
    }
    isr_paths = {
      hash_key = "pk"
      range_key = "sk"
      ttl_attribute = "ttl"
    }
    isr_locks = {
      hash_key = "pk"
      ttl_attribute = "ttl"
    }
  }

  tags = local.common_tags
}

# ============================================================================
# Cloud Functions
# ============================================================================

# Service account for functions
resource "yandex_iam_service_account" "functions" {
  name        = "${local.prefix}-functions-sa"
  description = "Service account for Cloud Functions"
}

# Grant necessary permissions
resource "yandex_resourcemanager_folder_iam_member" "functions_invoker" {
  folder_id = var.folder_id
  role      = "serverless.functions.invoker"
  member    = "serviceAccount:${yandex_iam_service_account.functions.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "storage_viewer" {
  folder_id = var.folder_id
  role      = "storage.viewer"
  member    = "serviceAccount:${yandex_iam_service_account.functions.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "storage_editor" {
  folder_id = var.folder_id
  role      = "storage.editor"
  member    = "serviceAccount:${yandex_iam_service_account.functions.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "lockbox_payload_viewer" {
  folder_id = var.folder_id
  role      = "lockbox.payloadViewer"
  member    = "serviceAccount:${yandex_iam_service_account.functions.id}"
}

# Server function (SSR/API)
resource "yandex_function" "server" {
  count = local.manifest.capabilities.needsServer ? 1 : 0

  name               = "${local.prefix}-server-function"
  description        = "Next.js SSR and API handler"
  user_hash          = var.build_id
  runtime            = "nodejs18"
  entrypoint        = local.manifest.artifacts.server.entry
  memory             = local.manifest.deployment.functions.server.memory
  execution_timeout  = local.manifest.deployment.functions.server.timeout
  service_account_id = yandex_iam_service_account.functions.id

  # Environment variables
  environment = merge(
    local.manifest.artifacts.server.env,
    {
      BUILD_ID             = var.build_id
      NODE_ENV             = "production"
      CACHE_BUCKET         = var.enable_isr ? yandex_storage_bucket.cache[0].bucket : ""
      ASSETS_BUCKET        = yandex_storage_bucket.assets.bucket
      YDB_DOCAPI_ENDPOINT  = var.enable_isr ? module.ydb_docapi[0].endpoint : ""
      REVALIDATE_SECRET_ID = module.security.revalidate_secret_id
    }
  )

  # Secrets from Lockbox
  secrets {
    id                   = module.security.revalidate_secret_id
    version_id           = module.security.revalidate_secret_version
    key                  = "hmac_secret"
    environment_variable = "REVALIDATE_SECRET"
  }

  # Function package
  content {
    zip_filename = var.server_zip_path != "" ? var.server_zip_path : "${var.build_dir}/artifacts/server.zip"
  }

  tags = local.common_tags

  # Log configuration
  log_options {
    disabled = false
    min_level = "INFO"
  }
}

# Publish function version
resource "yandex_function_version" "server" {
  count = local.manifest.capabilities.needsServer ? 1 : 0

  function_id = yandex_function.server[0].id
  runtime     = yandex_function.server[0].runtime
  entrypoint  = yandex_function.server[0].entrypoint
  memory      = yandex_function.server[0].memory
  execution_timeout = yandex_function.server[0].execution_timeout
  service_account_id = yandex_function.server[0].service_account_id
  environment = yandex_function.server[0].environment

  # Use content from function
  package_source {
    function_id = yandex_function.server[0].id
    version_id  = yandex_function.server[0].version
  }

  tags = local.common_tags
}

# Image optimization function
resource "yandex_function" "image" {
  count = local.manifest.capabilities.needsImage ? 1 : 0

  name               = "${local.prefix}-image-function"
  description        = "Next.js image optimization handler"
  user_hash          = var.build_id
  runtime            = "nodejs18"
  entrypoint        = local.manifest.artifacts.image.entry
  memory             = local.manifest.deployment.functions.image.memory
  execution_timeout  = local.manifest.deployment.functions.image.timeout
  service_account_id = yandex_iam_service_account.functions.id

  environment = merge(
    local.manifest.artifacts.image.env,
    {
      BUILD_ID      = var.build_id
      NODE_ENV      = "production"
      CACHE_BUCKET  = var.enable_isr ? yandex_storage_bucket.cache[0].bucket : ""
      ASSETS_BUCKET = yandex_storage_bucket.assets.bucket
    }
  )

  content {
    zip_filename = var.image_zip_path != "" ? var.image_zip_path : "${var.build_dir}/artifacts/image.zip"
  }

  tags = local.common_tags

  log_options {
    disabled  = false
    min_level = "INFO"
  }
}

# Publish image function version
resource "yandex_function_version" "image" {
  count = local.manifest.capabilities.needsImage ? 1 : 0

  function_id = yandex_function.image[0].id
  runtime     = yandex_function.image[0].runtime
  entrypoint  = yandex_function.image[0].entrypoint
  memory      = yandex_function.image[0].memory
  execution_timeout = yandex_function.image[0].execution_timeout
  service_account_id = yandex_function.image[0].service_account_id
  environment = yandex_function.image[0].environment

  package_source {
    function_id = yandex_function.image[0].id
    version_id  = yandex_function.image[0].version
  }

  tags = local.common_tags
}

# ============================================================================
# API Gateway
# ============================================================================

# Generate OpenAPI spec from template
locals {
  openapi_spec = templatefile("${path.module}/templates/openapi.yaml.tpl", {
    api_name             = "${local.prefix}-api"
    assets_bucket        = yandex_storage_bucket.assets.bucket
    build_id             = var.build_id
    server_function_id   = local.manifest.capabilities.needsServer ? yandex_function.server[0].id : ""
    server_version_id    = local.manifest.capabilities.needsServer ? yandex_function_version.server[0].id : ""
    image_function_id    = local.manifest.capabilities.needsImage ? yandex_function.image[0].id : ""
    image_version_id     = local.manifest.capabilities.needsImage ? yandex_function_version.image[0].id : ""
    service_account_id   = yandex_iam_service_account.functions.id
    has_server          = local.manifest.capabilities.needsServer
    has_image           = local.manifest.capabilities.needsImage
  })
}

resource "yandex_api_gateway" "main" {
  name        = "${local.prefix}-api-gateway"
  description = "API Gateway for Next.js application"

  spec = local.openapi_spec

  labels = local.common_tags
}

# ============================================================================
# DNS and TLS Certificate
# ============================================================================

resource "yandex_dns_zone" "main" {
  count = var.create_dns_zone ? 1 : 0

  name        = "${local.prefix}-zone"
  description = "DNS zone for ${var.domain_name}"
  zone        = "${var.domain_name}."
  public      = true

  labels = local.common_tags
}

resource "yandex_cm_certificate" "main" {
  name    = "${local.prefix}-cert"
  domains = [var.domain_name]

  managed {
    challenge_type = "DNS_CNAME"
  }

  labels = local.common_tags
}

# DNS validation records
resource "yandex_dns_recordset" "validation" {
  for_each = {
    for idx, record in yandex_cm_certificate.main.challenges : idx => record
    if record.type == "DNS_CNAME"
  }

  zone_id = var.create_dns_zone ? yandex_dns_zone.main[0].id : var.dns_zone_id
  name    = each.value.dns_name
  type    = "CNAME"
  ttl     = 60
  data    = [each.value.dns_value]
}

# API Gateway custom domain
resource "yandex_dns_recordset" "api_gateway" {
  count = var.create_dns_zone ? 1 : 0

  zone_id = yandex_dns_zone.main[0].id
  name    = var.domain_name
  type    = "CNAME"
  ttl     = 300
  data    = [yandex_api_gateway.main.domain]
}

# ============================================================================
# Monitoring and Logging
# ============================================================================

# Create log group for functions
resource "yandex_logging_group" "functions" {
  name             = "${local.prefix}-functions-logs"
  description      = "Logs for Cloud Functions"
  folder_id        = var.folder_id
  retention_period = "168h" # 7 days

  labels = local.common_tags
}

# ============================================================================
# Helper Resources
# ============================================================================

resource "random_id" "bucket_suffix" {
  byte_length = 4
}