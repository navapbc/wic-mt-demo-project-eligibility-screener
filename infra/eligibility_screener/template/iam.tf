# ECR repository
data "aws_ecr_repository" "eligibility-screener-repository"{
  name                 = "eligibility-screener-repo"
}

resource "aws_ecr_repository_policy" "eligibility-screener-repo-policy" {
  repository = data.aws_ecr_repository.eligibility-screener-repository.name
  policy     = data.aws_iam_policy_document.ecr-perms.json
}

data "aws_iam_policy_document" "ecr-perms" {
  statement {
    sid = "ECRPerms"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:CompleteLayerUpload",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetLifecyclePolicy",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart"
    ]
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
  }
}

# add ecr perms (push)
data "aws_iam_policy_document" "deploy_action" {
  statement {
    sid     = "WICUpdateECR"
    actions = ["ecs:UpdateCluster", "ecs:UpdateService", "ecs:DescribeClusters", "ecs:DescribeServices", "ecr:*"]
    resources = [
      "arn:aws:ecs:us-east-1:546642427916:service/${var.environment_name}/*",
      "arn:aws:ecs:us-east-1:546642427916:cluster/${var.environment_name}",
      data.aws_ecr_repository.eligibility-screener-repository.arn,
    ]
  }
  statement {
    sid       = "WICLogin"
    actions   = ["ecr:GetAuthorizationToken"]
    resources = ["*"]
  }
}