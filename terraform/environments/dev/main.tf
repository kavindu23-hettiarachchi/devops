terraform {
  required_version = ">= 1.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }

  # Uncomment for remote state management (recommended for production)
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "devops/dev/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-lock"
  # }
}

module "app" {
  source = "../../"

  # Dev-specific settings
  project_name = "devops"
  environment  = "dev"
  docker_host  = "unix:///var/run/docker.sock" # WSL/Linux

  mongodb_database = "demo"
  node_env         = "development"

  tags = {
    Environment = "dev"
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
