output "container_id" {
  description = "Frontend container ID"
  value       = docker_container.frontend.id
}

output "container_name" {
  description = "Frontend container name"
  value       = docker_container.frontend.name
}

output "container_ports" {
  description = "Frontend container port mappings"
  value       = docker_container.frontend.ports
}
