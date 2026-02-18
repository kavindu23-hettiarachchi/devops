#!/bin/bash

# Quick setup script for Terraform
# Usage: bash setup.sh

set -e

echo "🚀 Setting up Terraform for DevOps Project..."

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform is not installed. Please install it first."
    echo "   Visit: https://www.terraform.io/downloads"
    exit 1
fi

echo "✅ Terraform is installed: $(terraform version | head -n 1)"

# Initialize Terraform
echo ""
echo "📦 Initializing Terraform..."
terraform init

# Create terraform.tfvars if it doesn't exist
if [ ! -f "terraform.tfvars" ]; then
    echo ""
    echo "📝 Creating terraform.tfvars from example..."
    cp terraform.tfvars.example terraform.tfvars
    echo "⚠️  Please edit terraform.tfvars with your values!"
fi

# Validate configuration
echo ""
echo "✔️  Validating Terraform configuration..."
terraform validate

# Format code
echo ""
echo "🎨 Formatting Terraform files..."
terraform fmt -recursive

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit terraform.tfvars with your settings"
echo "2. Run: terraform plan"
echo "3. Run: terraform apply"
echo ""
echo "To view all outputs:"
echo "   terraform output"
