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

