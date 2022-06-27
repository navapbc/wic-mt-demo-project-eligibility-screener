# this file should contain information about tf versions and required providers

terraform {
  required_version = "1.2.0"

  required_providers {
    aws  = {
      source  = "hashicorp/aws"
      version = "~> 4.16.0" 
    }
  }
}

provider "aws" {
  region = "us-east-1"
  profile = "wic-mt"
}
data "aws_region" "current" {
}

data "aws_caller_identity" "current" {
  
}
