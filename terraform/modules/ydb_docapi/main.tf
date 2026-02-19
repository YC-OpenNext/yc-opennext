terraform {
  required_version = ">= 1.5.0"

  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.100.0"
    }

    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [aws.ydb]
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

# Create static access key for DocAPI
resource "yandex_iam_service_account_static_access_key" "ydb_docapi" {
  service_account_id = yandex_iam_service_account.ydb.id
  description        = "Static key for YDB DocAPI access"
}

# ============================================================================
# DynamoDB Tables via DocAPI
# ============================================================================

# Note: YDB DocAPI requires AWS provider configured with YDB endpoint
# The tables are created using AWS DynamoDB resources but backed by YDB

# ISR entries table
resource "aws_dynamodb_table" "isr_entries" {
  provider = aws.ydb

  name           = "${local.prefix}_isr_entries"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = lookup(var.tables.isr_entries, "hash_key", "pk")
  range_key      = lookup(var.tables.isr_entries, "range_key", "sk")

  attribute {
    name = lookup(var.tables.isr_entries, "hash_key", "pk")
    type = "S"
  }

  attribute {
    name = lookup(var.tables.isr_entries, "range_key", "sk")
    type = "S"
  }

  ttl {
    enabled        = true
    attribute_name = lookup(var.tables.isr_entries, "ttl_attribute", "ttl")
  }

  tags = var.tags

  lifecycle {
    ignore_changes = [read_capacity, write_capacity]
  }
}

# ISR tags table
resource "aws_dynamodb_table" "isr_tags" {
  provider = aws.ydb

  name           = "${local.prefix}_isr_tags"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = lookup(var.tables.isr_tags, "hash_key", "pk")
  range_key      = lookup(var.tables.isr_tags, "range_key", "sk")

  attribute {
    name = lookup(var.tables.isr_tags, "hash_key", "pk")
    type = "S"
  }

  attribute {
    name = lookup(var.tables.isr_tags, "range_key", "sk")
    type = "S"
  }

  ttl {
    enabled        = true
    attribute_name = lookup(var.tables.isr_tags, "ttl_attribute", "ttl")
  }

  tags = var.tags

  lifecycle {
    ignore_changes = [read_capacity, write_capacity]
  }
}

# ISR paths table
resource "aws_dynamodb_table" "isr_paths" {
  provider = aws.ydb

  name           = "${local.prefix}_isr_paths"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = lookup(var.tables.isr_paths, "hash_key", "pk")
  range_key      = lookup(var.tables.isr_paths, "range_key", "sk")

  attribute {
    name = lookup(var.tables.isr_paths, "hash_key", "pk")
    type = "S"
  }

  attribute {
    name = lookup(var.tables.isr_paths, "range_key", "sk")
    type = "S"
  }

  ttl {
    enabled        = true
    attribute_name = lookup(var.tables.isr_paths, "ttl_attribute", "ttl")
  }

  tags = var.tags

  lifecycle {
    ignore_changes = [read_capacity, write_capacity]
  }
}

# ISR locks table (for concurrency control)
resource "aws_dynamodb_table" "isr_locks" {
  provider = aws.ydb

  name           = "${local.prefix}_isr_locks"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = lookup(var.tables.isr_locks, "hash_key", "pk")

  attribute {
    name = lookup(var.tables.isr_locks, "hash_key", "pk")
    type = "S"
  }

  ttl {
    enabled        = true
    attribute_name = lookup(var.tables.isr_locks, "ttl_attribute", "ttl")
  }

  tags = var.tags

  lifecycle {
    ignore_changes = [read_capacity, write_capacity]
  }
}

# ============================================================================
# Store YDB credentials in Lockbox
# ============================================================================

resource "yandex_lockbox_secret" "ydb_docapi" {
  name        = "${local.prefix}-ydb-docapi-keys"
  description = "YDB DocAPI access keys"

  labels = var.tags
}

resource "yandex_lockbox_secret_version" "ydb_docapi" {
  secret_id = yandex_lockbox_secret.ydb_docapi.id

  entries {
    key        = "access_key"
    text_value = yandex_iam_service_account_static_access_key.ydb_docapi.access_key
  }

  entries {
    key        = "secret_key"
    text_value = yandex_iam_service_account_static_access_key.ydb_docapi.secret_key
  }

  entries {
    key        = "endpoint"
    text_value = "https://docapi.serverless.yandexcloud.net/ru-central1/${yandex_ydb_database_serverless.main.id}"
  }
}