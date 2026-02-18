# Terraform Infrastructure Setup Guide

## 📁 Project Structure

```
terraform/
├── providers.tf           # Terraform provider configuration
├── main.tf               # Main infrastructure definitions
├── variables.tf          # Variable declarations
├── outputs.tf            # Output values
├── terraform.tfvars.example  # Example variables file
│
├── modules/
│   ├── mongodb/          # MongoDB database module
│   ├── backend/          # Express.js backend module
│   └── frontend/         # React frontend module
│
└── environments/
    ├── dev/              # Development environment config
    └── prod/             # Production environment config
```

## 🚀 Quick Start

### 1. **Install Terraform**

**Windows:**
```powershell
choco install terraform
```

Or download from: https://www.terraform.io/downloads

**Verify installation:**
```bash
terraform version
```

### 2. **Initialize Terraform**

```bash
cd terraform
terraform init
```

This will:
- Download required providers (Docker provider)
- Initialize the backend
- Prepare the working directory

### 3. **Create Your Variables File**

```bash
# Copy the example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
vim terraform.tfvars
```

**Key variables to update:**
```hcl
project_name = "devops"
docker_host  = "unix:///var/run/docker.sock"  # For WSL/Linux
jwt_secret   = "your_secure_secret_here"
```

### 4. **Plan Your Infrastructure**

```bash
terraform plan -out=tfplan
```

This shows what will be created, modified, or destroyed.

### 5. **Apply the Configuration**

```bash
terraform apply tfplan
```

Or directly without saving a plan:
```bash
terraform apply
```

## 📊 Important Variables

### Docker Configuration
- **docker_host**: Docker daemon socket
  - Linux/WSL: `unix:///var/run/docker.sock`
  - Windows Docker Desktop: `npipe:////./pipe/docker_engine`

### MongoDB
- **mongodb_version**: Version tag (default: 6.0)
- **mongodb_port**: Port number (default: 27017)
- **mongodb_database**: Initial database name (default: demo)

### Backend
- **backend_port**: Internal port (default: 5000)
- **backend_external_port**: External port (default: 4000)
- **jwt_secret**: JWT signing secret (⚠️ CHANGE IN PRODUCTION)
- **node_env**: development or production

### Frontend
- **frontend_port**: Internal port (default: 80)
- **frontend_external_port**: External port (default: 3000)

## 🔍 Useful Commands

```bash
# View current state
terraform state list
terraform state show module.mongodb.docker_container.mongodb

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy all resources
terraform destroy

# Format Terraform files
terraform fmt -recursive

# Validate configuration
terraform validate

# Show outputs
terraform output
terraform output backend_url_external
```

## 📝 Module Details

### MongoDB Module (`modules/mongodb/`)
- Creates MongoDB 6.0 container
- Configures persistent volume
- Sets up health checks
- Opens port 27017

### Backend Module (`modules/backend/`)
- Builds and runs Express.js server
- Configures environment variables
- Sets up MongoDB connection
- Exposes on port 4000 (external)

### Frontend Module (`modules/frontend/`)
- Builds and runs React app with Nginx
- Configures backend API URL
- Exposes on port 3000 (external)

## 🌐 URLs After Deployment

Once deployed, access your services at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **MongoDB**: localhost:27017 (internal only)

## ⚙️ Environment-Specific Deployment

### Development
```bash
cd environments/dev
terraform init
terraform apply
```

### Production
```bash
cd environments/prod
terraform init
terraform apply
```

## 🔒 Security Best Practices

1. **Never commit sensitive data**
   ```bash
   # Add to .gitignore
   terraform.tfvars
   *.tfstate
   *.tfstate.*
   ```

2. **Use remote state** (production)
   ```hcl
   backend "s3" {
     bucket         = "your-state-bucket"
     key            = "devops/terraform.tfstate"
     encrypt        = true
   }
   ```

3. **Rotate JWT secret regularly**
   ```bash
   terraform apply -var="jwt_secret=new_secret"
   ```

4. **Use Terraform Cloud for team collaboration**
   - Sign up at https://app.terraform.io
   - Configure remote backend in providers.tf

## 🐛 Troubleshooting

### Docker daemon not accessible
```bash
# Check if Docker is running
docker ps

# Verify socket permissions
ls -la /var/run/docker.sock

# For Windows, restart Docker Desktop
```

### Container fails to start
```bash
# Check container logs
docker logs container_name

# View Terraform state
terraform state show module.backend.docker_container.backend
```

### Port conflicts
Change the external port in terraform.tfvars:
```hcl
backend_external_port = 5000  # Changed from 4000
frontend_external_port = 3001 # Changed from 3000
```

## 📚 Additional Resources

- [Terraform Documentation](https://www.terraform.io/docs)
- [Docker Provider](https://registry.terraform.io/providers/kreuzwerker/docker/latest)
- [Terraform Best Practices](https://terraform.best-practices.com/)

## 🆘 Support

For issues:
1. Check `terraform validate` output
2. Review `terraform plan` carefully
3. Check Docker daemon logs: `docker daemon logs`
4. Verify your docker_host setting

