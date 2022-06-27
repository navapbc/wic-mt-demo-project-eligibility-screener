# this file should contain information about tf versions and required providers

terraform {
  required_version = "1.2.0"

  required_providers {
    aws  = {
      source  = "hashicorp/aws"
      version = "~> 4.16.0" 
    }
  }
  backend "s3" {
    bucket         = "wic-mt-tf-state"
    key            = "terraform/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = "true"
    # dynamodb_table = "terraform_locks" 
    profile = "wic-mt" 
  }
}

#todo create dynamnodb table

provider "aws" {
  region = "us-east-1"
  profile = "wic-mt"
}
data "aws_region" "current" {
}

data "aws_caller_identity" "current" {
  
}
