terraform {
  required_version = ">= 1.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }

  # Remote state for production (recommended)
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "devops/prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-lock"
  # }
}

module "app" {
  source = "../../"

  # Production-specific settings
  project_name = "devops"
  environment  = "prod"
  docker_host  = "unix:///var/run/docker.sock"

  mongodb_database = "food_delivery_prod"
  node_env         = "production"

  tags = {
    Environment = "prod"
    Project     = "devops"
    ManagedBy   = "terraform"
  }
}

output "mongodb_connection" {
  value = module.app.mongodb_connection_string
}

output "backend_url" {
  value = module.app.backend_url_external
}

output "frontend_url" {
  value = module.app.frontend_url
}
