variable "app_name" {
  description = "Application name"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,30}$", var.app_name))
    error_message = "App name must be lowercase alphanumeric with hyphens, 3-31 characters."
  }
}

variable "env" {
  description = "Environment (dev, staging, production)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "production"], var.env)
    error_message = "Environment must be dev, staging, or production."
  }
}

variable "cloud_id" {
  description = "Yandex Cloud ID"
  type        = string
}

variable "folder_id" {
  description = "Yandex Cloud Folder ID"
  type        = string
}

variable "region" {
  description = "Yandex Cloud region"
  type        = string
  default     = "ru-central1"
}

variable "domain_name" {
  description = "Custom domain name for the application"
  type        = string
}

variable "build_id" {
  description = "Build ID for blue-green deployment"
  type        = string
}

variable "manifest_path" {
  description = "Path to deployment manifest JSON file"
  type        = string
}

variable "build_dir" {
  description = "Directory containing build artifacts"
  type        = string
  default     = ""
}

variable "server_zip_path" {
  description = "Path to server function zip (optional, uses manifest path if not set)"
  type        = string
  default     = ""
}

variable "image_zip_path" {
  description = "Path to image function zip (optional, uses manifest path if not set)"
  type        = string
  default     = ""
}

variable "enable_isr" {
  description = "Enable Incremental Static Regeneration"
  type        = bool
  default     = true
}

variable "enable_cdn" {
  description = "Enable Cloud CDN for static assets"
  type        = bool
  default     = false
}

variable "enable_queue" {
  description = "Enable YMQ queue for async revalidation"
  type        = bool
  default     = false
}

variable "cache_ttl_days" {
  description = "TTL for cache entries in days"
  type        = number
  default     = 30
}

variable "allowed_origins" {
  description = "Allowed CORS origins for assets bucket"
  type        = list(string)
  default     = ["*"]
}

variable "allowed_cidrs" {
  description = "Allowed CIDR blocks for revalidation endpoint"
  type        = list(string)
  default     = []
}

variable "create_dns_zone" {
  description = "Create DNS zone (set to false if zone already exists)"
  type        = bool
  default     = true
}

variable "dns_zone_id" {
  description = "Existing DNS zone ID (required if create_dns_zone is false)"
  type        = string
  default     = ""
}

variable "prepared_instances" {
  description = "Number of prepared function instances"
  type = object({
    server = number
    image  = number
  })
  default = {
    server = 0
    image  = 0
  }
}

variable "function_timeout" {
  description = "Function execution timeout in seconds"
  type = object({
    server = number
    image  = number
  })
  default = {
    server = 30
    image  = 30
  }
}

variable "function_memory" {
  description = "Function memory in MB"
  type = object({
    server = number
    image  = number
  })
  default = {
    server = 512
    image  = 256
  }
}

variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}