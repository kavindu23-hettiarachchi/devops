resource "docker_image" "mongodb" {
  name          = "mongo:${var.image_tag}"
  keep_locally  = false
  pull_image    = true
}

resource "docker_container" "mongodb" {
  name  = var.container_name
  image = docker_image.mongodb.image_id

  ports {
    internal = var.port
    external = var.port
  }

  env = [
    "MONGO_INITDB_DATABASE=${var.database_name}"
  ]

  volumes {
    host_path      = "${path.module}/mongodb_data"
    container_path = "/data/db"
  }

  networks_advanced {
    name = var.network_name
  }

  restart_policy = "unless-stopped"

  healthcheck {
    test     = ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
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
