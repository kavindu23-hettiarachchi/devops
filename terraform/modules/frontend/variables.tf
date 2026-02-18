variable "container_name" {
  description = "Frontend container name"
  type        = string
}

variable "image_name" {
  description = "Docker image name for frontend"
  type        = string
  default     = "devops-frontend"
}

variable "port" {
  description = "Frontend service port"
  type        = number
  default     = 80
}

variable "external_port" {
  description = "External port mapping"
  type        = number
  default     = 3000
}

variable "network_name" {
  description = "Docker network name"
  type        = string
}

variable "docker_build_path" {
  description = "Path to Dockerfile"
  type        = string
  default     = "../frontend"
}

variable "backend_url" {
  description = "Backend API URL"
  type        = string
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
