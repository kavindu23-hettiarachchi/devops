variable "docker_host" {
  description = "Docker daemon socket path"
  type        = string
  default     = "unix:///var/run/docker.sock" # For Linux/WSL
  # Use "npipe:////./pipe/docker_engine" for Windows Docker Desktop
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "devops"
}

variable "environment" {
  description = "Environment name (dev, prod, staging)"
  type        = string
  default     = "dev"
}

# MongoDB Variables
variable "mongodb_version" {
  description = "MongoDB Docker image version"
  type        = string
  default     = "6.0"
}

variable "mongodb_port" {
  description = "MongoDB port"
  type        = number
  default     = 27017
}

variable "mongodb_database" {
  description = "MongoDB initial database name"
  type        = string
  default     = "demo"
}

# Backend Variables
variable "backend_image_name" {
  description = "Backend Docker image name"
  type        = string
  default     = "devops-backend"
}

variable "backend_port" {
  description = "Backend service port"
  type        = number
  default     = 5000
}

variable "backend_external_port" {
  description = "Backend external port mapping"
  type        = number
  default     = 4000
}

variable "backend_build_path" {
  description = "Path to backend Dockerfile"
  type        = string
  default     = "../backend"
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
  default     = "your_jwt_secret_key_change_this_in_production"
}

variable "node_env" {
  description = "Node environment"
  type        = string
  default     = "development"
}

# Frontend Variables
variable "frontend_image_name" {
  description = "Frontend Docker image name"
  type        = string
  default     = "devops-frontend"
}

variable "frontend_port" {
  description = "Frontend service port"
  type        = number
  default     = 80
}

variable "frontend_external_port" {
  description = "Frontend external port mapping"
  type        = number
  default     = 3000
}

variable "frontend_build_path" {
  description = "Path to frontend Dockerfile"
  type        = string
  default     = "../frontend"
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Environment = "dev"
    Project     = "devops"
    ManagedBy   = "terraform"
  }
}
