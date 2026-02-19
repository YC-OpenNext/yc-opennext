output "api_gateway_domain" {
  description = "API Gateway domain"
  value       = yandex_api_gateway.main.domain
}

output "api_gateway_id" {
  description = "API Gateway ID"
  value       = yandex_api_gateway.main.id
}

output "custom_domain" {
  description = "Custom domain name"
  value       = var.domain_name
}

output "certificate_status" {
  description = "TLS certificate status"
  value       = yandex_cm_certificate.main.status
}

output "assets_bucket" {
  description = "Assets bucket name"
  value       = yandex_storage_bucket.assets.bucket
}

output "cache_bucket" {
  description = "Cache bucket name"
  value       = var.enable_isr ? yandex_storage_bucket.cache[0].bucket : null
}

output "server_function_id" {
  description = "Server function ID"
  value       = local.manifest.capabilities.needsServer ? yandex_function.server[0].id : null
}

output "server_function_version" {
  description = "Server function version ID"
  value       = local.manifest.capabilities.needsServer ? yandex_function_version.server[0].id : null
}

output "image_function_id" {
  description = "Image function ID"
  value       = local.manifest.capabilities.needsImage ? yandex_function.image[0].id : null
}

output "image_function_version" {
  description = "Image function version ID"
  value       = local.manifest.capabilities.needsImage ? yandex_function_version.image[0].id : null
}

output "ydb_endpoint" {
  description = "YDB DocAPI endpoint"
  value       = var.enable_isr ? module.ydb_docapi[0].endpoint : null
  sensitive   = true
}

output "lockbox_secret_ids" {
  description = "Lockbox secret IDs (not values)"
  value = {
    revalidate_secret = module.security.revalidate_secret_id
    storage_keys      = module.security.storage_keys_secret_id
  }
}

output "service_account_id" {
  description = "Service account ID for functions"
  value       = yandex_iam_service_account.functions.id
}

output "log_group_id" {
  description = "Log group ID for functions"
  value       = yandex_logging_group.functions.id
}

output "deployment_info" {
  description = "Deployment information"
  value = {
    build_id    = var.build_id
    deployed_at = timestamp()
    region      = var.region
    environment = var.env
  }
}

output "name_servers" {
  description = "Name servers for DNS zone"
  value       = var.create_dns_zone ? yandex_dns_zone.main[0].name_servers : []
}