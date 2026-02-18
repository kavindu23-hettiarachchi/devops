resource "docker_image" "backend" {
  name = var.image_name
  build {
    context    = var.docker_build_path
    dockerfile = "Dockerfile"
  }
  keep_locally = false
}

resource "docker_container" "backend" {
  name  = var.container_name
  image = docker_image.backend.image_id

  ports {
    internal = var.port
    external = var.external_port
  }

  env = [
    "MONGODB_URI=${var.mongodb_uri}",
    "PORT=${var.port}",
    "JWT_SECRET=${var.jwt_secret}",
    "NODE_ENV=${var.node_env}"
  ]

  networks_advanced {
    name = var.network_name
  }

  restart_policy = "unless-stopped"

  depends_on = []

  healthcheck {
    test     = ["CMD", "curl", "-f", "http://localhost:${var.port}/health || exit 1"]
    interval = "10s"
    timeout  = "5s"
    retries  = 5
  }

  labels = {
    Environment = lookup(var.tags, "Environment", "dev")
    Project     = lookup(var.tags, "Project", "devops")
    ManagedBy   = "terraform"
  }

  lifecycle {
    ignore_changes = [ports]
  }
}
