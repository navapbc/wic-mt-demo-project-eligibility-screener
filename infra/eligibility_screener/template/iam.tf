# ----------------------------------------------------------
# 
# IAM Deployment Role
#
# ----------------------------------------------------------

data "aws_iam_user" "github_actions" {
  user_name = "wic-mt-github-actions"
}
data "aws_iam_role" "github_actions" {
  name               = "deployment-action"
}

resource "aws_iam_role_policy_attachment" "github_actions" {
  role       = data.aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.deploy_action.arn
}

resource "aws_iam_policy" "deploy_action" {
  name   = "${var.environment_name}-wic-mt-deploy"
  policy = data.aws_iam_policy_document.deploy_action.json
}

resource "aws_iam_user_policy_attachment" "deploy_action" {
  user       = data.aws_iam_user.github_actions.user_name
  policy_arn = aws_iam_policy.deploy_action.arn
}
# ----------------------------------------------------------
# 
# ECR Repo
#
# ----------------------------------------------------------

data "aws_ecr_repository" "eligibility-screener-repository"{
  name                 = "eligibility-screener-repo"
}

# ----------------------------------------------------------
# 
# IAM for ECR
#
# ----------------------------------------------------------
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