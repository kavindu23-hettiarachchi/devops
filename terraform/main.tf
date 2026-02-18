module "mongodb" {
  source = "./modules/mongodb"

  container_name = "${var.project_name}-mongodb"
  image_tag      = var.mongodb_version
  port           = var.mongodb_port
  database_name  = var.mongodb_database
  network_name   = docker_network.app_network.name

  tags = var.tags
}

module "backend" {
  source = "./modules/backend"

  depends_on = [module.mongodb]

  container_name = "${var.project_name}-backend"
  image_name     = var.backend_image_name
  port           = var.backend_port
  network_name   = docker_network.app_network.name

  mongodb_uri       = module.mongodb.connection_string
  jwt_secret        = var.jwt_secret
  node_env          = var.node_env
  docker_build_path = var.backend_build_path

  tags = var.tags
}

module "frontend" {
  source = "./modules/frontend"

  depends_on = [module.backend]

  container_name = "${var.project_name}-frontend"
  image_name     = var.frontend_image_name
  port           = var.frontend_port
  network_name   = docker_network.app_network.name

  backend_url       = "http://${module.backend.container_name}:${var.backend_port}"
  docker_build_path = var.frontend_build_path

  tags = var.tags
}

# Docker network for container communication
resource "docker_network" "app_network" {
  name   = "${var.project_name}-network"
  driver = "bridge"
}
