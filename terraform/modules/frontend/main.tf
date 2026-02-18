resource "docker_image" "frontend" {
  name = var.image_name
  build {
    context    = var.docker_build_path
    dockerfile = "Dockerfile"
  }
  keep_locally = false
}

resource "docker_container" "frontend" {
  name  = var.container_name
  image = docker_image.frontend.image_id

  ports {
    internal = var.port
    external = var.external_port
  }

  env = [
    "VITE_API_URL=${var.backend_url}",
    "REACT_APP_API_URL=${var.backend_url}"
  ]

  networks_advanced {
    name = var.network_name
  }

  restart_policy = "unless-stopped"

  healthcheck {
    test     = ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:${var.port}/ || exit 1"]
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
