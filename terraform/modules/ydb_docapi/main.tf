terraform {
  required_version = ">= 1.5.0"

  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.100.0"
    }
  }
}

locals {
  prefix = "${var.app_name}-${var.env}"
}

# ============================================================================
# YDB Serverless Database
# ============================================================================

resource "yandex_ydb_database_serverless" "main" {
  name        = "${local.prefix}-ydb"
  description = "YDB serverless database for ${var.app_name} ISR metadata"

  serverless_database {
    enable_throttling_rcu_limit = var.enable_throttling
    throttling_rcu_limit        = var.throttling_rcu_limit
    storage_size_limit          = var.storage_size_limit
  }

  labels = var.tags
}

# ============================================================================
# Service Account for YDB
# ============================================================================

resource "yandex_iam_service_account" "ydb" {
  name        = "${local.prefix}-ydb-sa"
  description = "Service account for YDB access"
}

# Grant YDB editor role
resource "yandex_resourcemanager_folder_iam_member" "ydb_editor" {
  folder_id = var.folder_id
  role      = "ydb.editor"
  member    = "serviceAccount:${yandex_iam_service_account.ydb.id}"
}

# Create static access key for YDB access
resource "yandex_iam_service_account_static_access_key" "ydb" {
  service_account_id = yandex_iam_service_account.ydb.id
  description        = "Static key for YDB access"
}

# ============================================================================
# Note: Table creation via Terraform
# ============================================================================
# YDB tables need to be created via YQL queries or application code.
# Terraform doesn't have native resources for YDB table management.
# The application should handle table creation on first run.
#
# Required tables structure:
# - isr_entries: For storing ISR page entries
# - isr_tags: For tracking tags
# - isr_paths: For tracking paths
# - isr_locks: For locking during revalidation