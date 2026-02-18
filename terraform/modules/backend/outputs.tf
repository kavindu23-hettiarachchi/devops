output "container_id" {
  description = "Backend container ID"
  value       = docker_container.backend.id
}

output "container_name" {
  description = "Backend container name"
  value       = docker_container.backend.name
}

output "container_ports" {
  description = "Backend container port mappings"
  value       = docker_container.backend.ports
}
