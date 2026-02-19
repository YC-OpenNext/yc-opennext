provider "yandex" {
  # Cloud ID and folder ID should be provided via variables or environment
  cloud_id  = var.cloud_id
  folder_id = var.folder_id
  zone      = var.zone

  # Service account key file or token should be configured via environment:
  # export YC_SERVICE_ACCOUNT_KEY_FILE=path/to/key.json
  # or
  # export YC_TOKEN=$(yc iam create-token)
}

# AWS provider for YDB DocAPI (DynamoDB-compatible interface)
provider "aws" {
  alias = "ydb"

  endpoints {
    dynamodb = var.ydb_docapi_endpoint
  }

  region = "ru-central1" # YDB requires a region even though it's not AWS

  # Use static credentials for YDB DocAPI
  access_key = var.ydb_access_key
  secret_key = var.ydb_secret_key

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_requesting_account_id   = true
}

# Variables for providers
variable "cloud_id" {
  description = "Yandex Cloud ID"
  type        = string
}

variable "folder_id" {
  description = "Yandex Cloud Folder ID"
  type        = string
}

variable "zone" {
  description = "Yandex Cloud availability zone"
  type        = string
  default     = "ru-central1-a"
}

variable "ydb_docapi_endpoint" {
  description = "YDB Document API endpoint"
  type        = string
  default     = ""
}

variable "ydb_access_key" {
  description = "YDB DocAPI access key"
  type        = string
  default     = ""
  sensitive   = true
}

variable "ydb_secret_key" {
  description = "YDB DocAPI secret key"
  type        = string
  default     = ""
  sensitive   = true
}