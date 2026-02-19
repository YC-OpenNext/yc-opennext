output "database_id" {
  description = "YDB database ID"
  value       = yandex_ydb_database_serverless.main.id
}

output "database_name" {
  description = "YDB database name"
  value       = yandex_ydb_database_serverless.main.name
}

output "database_path" {
  description = "YDB database path"
  value       = yandex_ydb_database_serverless.main.database_path
}

output "endpoint" {
  description = "YDB endpoint"
  value       = yandex_ydb_database_serverless.main.ydb_full_endpoint
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

output "access_key_id" {
  description = "Access key ID for YDB"
  value       = yandex_iam_service_account_static_access_key.ydb.access_key
  sensitive   = true
}

output "secret_access_key" {
  description = "Secret access key for YDB"
  value       = yandex_iam_service_account_static_access_key.ydb.secret_key
  sensitive   = true
}