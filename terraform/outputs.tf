output "mongodb_connection_string" {
  description = "MongoDB connection string"
  value       = module.mongodb.connection_string
}

output "mongodb_container_id" {
  description = "MongoDB container ID"
  value       = module.mongodb.container_id
}

output "backend_container_id" {
  description = "Backend container ID"
  value       = module.backend.container_id
}

output "backend_url_internal" {
  description = "Backend URL for internal container communication"
  value       = "http://${module.backend.container_name}:${var.backend_port}"
}

output "backend_url_external" {
  description = "Backend URL accessible from host machine"
  value       = "http://localhost:${var.backend_external_port}"
}

output "frontend_container_id" {
  description = "Frontend container ID"
  value       = module.frontend.container_id
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "http://localhost:${var.frontend_external_port}"
}

output "app_network_id" {
  description = "Docker network ID"
  value       = docker_network.app_network.id
}

output "app_network_name" {
  description = "Docker network name"
  value       = docker_network.app_network.name
}
