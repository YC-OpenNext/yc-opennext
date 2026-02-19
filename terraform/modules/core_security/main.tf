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
  }
}

locals {
  prefix = "${var.app_name}-${var.env}"
}

# ============================================================================
# KMS Key for Encryption
# ============================================================================

resource "yandex_kms_symmetric_key" "main" {
  name              = "${local.prefix}-kms-key"
  description       = "KMS key for ${var.app_name} ${var.env} environment"
  default_algorithm = "AES_256"
  rotation_period   = "8760h" # 1 year

  labels = var.tags
}

# ============================================================================
# Lockbox Secrets
# ============================================================================

# Generate HMAC secret for revalidation
resource "random_password" "revalidate_hmac" {
  length  = 64
  special = true
}

# Store HMAC secret in Lockbox
resource "yandex_lockbox_secret" "revalidate" {
  name        = "${local.prefix}-revalidate-secret"
  description = "HMAC secret for ISR revalidation endpoint"

  labels = var.tags
}

resource "yandex_lockbox_secret_version" "revalidate" {
  secret_id = yandex_lockbox_secret.revalidate.id

  entries {
    key        = "hmac_secret"
    text_value = random_password.revalidate_hmac.result
  }
}

# Generate storage access keys
resource "random_password" "storage_access_key" {
  length  = 20
  special = false
  upper   = true
  lower   = true
  numeric = true
}

resource "random_password" "storage_secret_key" {
  length  = 40
  special = true
}

# Store storage keys in Lockbox
resource "yandex_lockbox_secret" "storage_keys" {
  name        = "${local.prefix}-storage-keys"
  description = "Object Storage access keys"

  labels = var.tags
}

resource "yandex_lockbox_secret_version" "storage_keys" {
  secret_id = yandex_lockbox_secret.storage_keys.id

  entries {
    key        = "access_key"
    text_value = random_password.storage_access_key.result
  }

  entries {
    key        = "secret_key"
    text_value = random_password.storage_secret_key.result
  }
}

# Optional: Database connection secret
resource "yandex_lockbox_secret" "database" {
  count = var.create_database_secret ? 1 : 0

  name        = "${local.prefix}-database-secret"
  description = "Database connection credentials"

  labels = var.tags
}

resource "random_password" "database_password" {
  count = var.create_database_secret ? 1 : 0

  length  = 32
  special = true
}

resource "yandex_lockbox_secret_version" "database" {
  count = var.create_database_secret ? 1 : 0

  secret_id = yandex_lockbox_secret.database[0].id

  entries {
    key        = "password"
    text_value = random_password.database_password[0].result
  }

  entries {
    key        = "username"
    text_value = var.database_username
  }

  entries {
    key        = "endpoint"
    text_value = var.database_endpoint
  }
}

# ============================================================================
# IAM Roles and Service Accounts
# ============================================================================

# Service account for API Gateway
resource "yandex_iam_service_account" "api_gateway" {
  name        = "${local.prefix}-api-gateway-sa"
  description = "Service account for API Gateway"
}

# Grant API Gateway permissions
resource "yandex_resourcemanager_folder_iam_member" "api_gateway_invoker" {
  folder_id = var.folder_id
  role      = "serverless.functions.invoker"
  member    = "serviceAccount:${yandex_iam_service_account.api_gateway.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "api_gateway_storage" {
  folder_id = var.folder_id
  role      = "storage.viewer"
  member    = "serviceAccount:${yandex_iam_service_account.api_gateway.id}"
}

# Service account for monitoring
resource "yandex_iam_service_account" "monitoring" {
  name        = "${local.prefix}-monitoring-sa"
  description = "Service account for monitoring and logging"
}

resource "yandex_resourcemanager_folder_iam_member" "monitoring_viewer" {
  folder_id = var.folder_id
  role      = "monitoring.viewer"
  member    = "serviceAccount:${yandex_iam_service_account.monitoring.id}"
}

resource "yandex_resourcemanager_folder_iam_member" "logging_reader" {
  folder_id = var.folder_id
  role      = "logging.reader"
  member    = "serviceAccount:${yandex_iam_service_account.monitoring.id}"
}

# ============================================================================
# Access Keys for Service Accounts
# ============================================================================

# Static access key for storage operations
resource "yandex_iam_service_account_static_access_key" "storage" {
  service_account_id = yandex_iam_service_account.api_gateway.id
  description        = "Static key for Object Storage access"
}

# Store the access key in Lockbox (never output directly)
resource "yandex_lockbox_secret" "storage_sa_keys" {
  name        = "${local.prefix}-storage-sa-keys"
  description = "Service account storage keys"

  labels = var.tags
}

resource "yandex_lockbox_secret_version" "storage_sa_keys" {
  secret_id = yandex_lockbox_secret.storage_sa_keys.id

  entries {
    key        = "access_key"
    text_value = yandex_iam_service_account_static_access_key.storage.access_key
  }

  entries {
    key        = "secret_key"
    text_value = yandex_iam_service_account_static_access_key.storage.secret_key
  }
}