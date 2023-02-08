resource "aws_ecr_repository" "eligibility-screener-repository" {
  name                 = "eligibility-screener-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}