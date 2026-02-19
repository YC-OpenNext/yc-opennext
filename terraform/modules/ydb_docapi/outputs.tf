output "database_id" {
  description = "YDB database ID"
  value       = yandex_ydb_database_serverless.main.id
}

output "database_name" {
  description = "YDB database name"
  value       = yandex_ydb_database_serverless.main.name
}

output "endpoint" {
  description = "YDB DocAPI endpoint"
  value       = "https://docapi.serverless.yandexcloud.net/ru-central1/${yandex_ydb_database_serverless.main.id}"
}

output "document_api_endpoint" {
  description = "YDB Document API endpoint"
  value       = yandex_ydb_database_serverless.main.document_api_endpoint
}

output "ydb_full_endpoint" {
  description = "YDB full endpoint"
  value       = yandex_ydb_database_serverless.main.ydb_full_endpoint
}

output "ydb_api_endpoint" {
  description = "YDB API endpoint"
  value       = yandex_ydb_database_serverless.main.ydb_api_endpoint
}

output "service_account_id" {
  description = "YDB service account ID"
  value       = yandex_iam_service_account.ydb.id
}

output "lockbox_secret_id" {
  description = "Lockbox secret ID for YDB DocAPI credentials"
  value       = yandex_lockbox_secret.ydb_docapi.id
}

output "table_names" {
  description = "Created DynamoDB table names"
  value = {
    entries = aws_dynamodb_table.isr_entries.name
    tags    = aws_dynamodb_table.isr_tags.name
    paths   = aws_dynamodb_table.isr_paths.name
    locks   = aws_dynamodb_table.isr_locks.name
  }
}

output "table_arns" {
  description = "Created DynamoDB table ARNs"
  value = {
    entries = aws_dynamodb_table.isr_entries.arn
    tags    = aws_dynamodb_table.isr_tags.arn
    paths   = aws_dynamodb_table.isr_paths.arn
    locks   = aws_dynamodb_table.isr_locks.arn
  }
}