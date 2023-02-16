# this file should contain information about tf versions and required providers

terraform {
  required_version = "1.2.0"

  backend "s3" {
    bucket         = "wic-mt-tf-state"
    key            = "terraform/screener/test.tfstate"
    region         = "us-east-1"
    encrypt        = "true"
    dynamodb_table = "wic_terraform_locks"
    profile        = "wic-mt" # may need to rethink this; no profile defaults to env variables
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16.0"
    }
  }
}

module "constants" {
  source = "../constants"
}

provider "aws" {
  region  = "us-east-1"
  profile = "wic-mt"
  default_tags {
    tags = merge(
      module.constants.screener_tags, {
        environment = var.environment_name
    })
  }
}
data "aws_region" "current" {
}

data "aws_caller_identity" "current" {

}
