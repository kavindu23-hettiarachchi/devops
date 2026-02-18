output "container_id" {
  description = "MongoDB container ID"
  value       = docker_container.mongodb.id
}

output "container_name" {
  description = "MongoDB container name"
  value       = docker_container.mongodb.name
}

output "connection_string" {
  description = "MongoDB connection string for internal use"
  value       = "mongodb://${var.container_name}:${var.port}/${var.database_name}"
}

output "host_connection_string" {
  description = "MongoDB connection string from host machine"
  value       = "mongodb://localhost:${var.port}/${var.database_name}"
}
