variable "container_name" {
  description = "Backend container name"
  type        = string
}

variable "image_name" {
  description = "Docker image name for backend"
  type        = string
  default     = "devops-backend"
}

variable "port" {
  description = "Backend service port"
  type        = number
  default     = 5000
}

variable "external_port" {
  description = "External port mapping"
  type        = number
  default     = 4000
}

variable "network_name" {
  description = "Docker network name"
  type        = string
}

variable "docker_build_path" {
  description = "Path to Dockerfile"
  type        = string
  default     = "../backend"
}

variable "mongodb_uri" {
  description = "MongoDB connection URI"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "node_env" {
  description = "Node environment"
  type        = string
  default     = "development"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
