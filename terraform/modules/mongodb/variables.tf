variable "container_name" {
  description = "MongoDB container name"
  type        = string
}

variable "image_tag" {
  description = "MongoDB image tag version"
  type        = string
  default     = "6.0"
}

variable "port" {
  description = "MongoDB port"
  type        = number
  default     = 27017
}

variable "database_name" {
  description = "Initial database name"
  type        = string
  default     = "demo"
}

variable "network_name" {
  description = "Docker network name"
  type        = string
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
