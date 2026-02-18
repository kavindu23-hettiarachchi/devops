# Terraform State Management Guide

## .gitignore

Add these to your `./.gitignore` to prevent committing sensitive state files:

```gitignore
# Terraform files
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl
terraform.tfvars
!terraform.tfvars.example
.tfvars
*.tfvars
crash.log
crash.*.log
override.tf
override.tf.json
*_override.tf
*_override.tf.json
.DS_Store
```

## Remote State (Production)

For production, use remote state instead of local files:

### AWS S3 Backend

1. **Create S3 bucket:**
```bash
aws s3 mb s3://devops-terraform-state
aws s3api put-bucket-versioning \
  --bucket devops-terraform-state \
  --versioning-configuration Status=Enabled
```

2. **Create DynamoDB table for locking:**
```bash
aws dynamodb create-table \
  --table-name terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

3. **Update providers.tf:**
```hcl
terraform {
  backend "s3" {
    bucket         = "devops-terraform-state"
    key            = "devops/dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

### Terraform Cloud

1. **Sign up:** https://app.terraform.io
2. **Create organization and workspace**
3. **Update providers.tf:**
```hcl
terraform {
  cloud {
    organization = "your-org"
    
    workspaces {
      name = "devops-dev"
    }
  }
}
```

4. **Authenticate:**
```bash
terraform login
# Paste your API token when prompted
```

## State File Operations

```bash
# View entire state
terraform state list
terraform state show

# Show specific resource
terraform state show 'module.mongodb.docker_container.mongodb'

# Replace resource (be careful!)
terraform state rm 'module.mongodb.docker_container.mongodb'
terraform apply  # Will recreate it

# Import existing resource
terraform import 'module.backend.docker_container.backend' container_id
```

## Workspace Management (Optional)

```bash
# Create workspace
terraform workspace new staging

# List workspaces
terraform workspace list

# Select workspace
terraform workspace select staging

# Delete workspace
terraform workspace delete staging
```

## Backup and Recovery

```bash
# Backup current state
cp terraform.tfstate terraform.tfstate.backup.$(date +%Y%m%d_%H%M%S)

# List all backup states
ls -la terraform.tfstate*
```
