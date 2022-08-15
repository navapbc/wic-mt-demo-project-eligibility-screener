# ----------------------------------------------------------
# 
# IAM Roles for Users
#
# ----------------------------------------------------------

resource "aws_iam_user" "github_actions" {
  name = "wic-mt-github-actions"
}
resource "aws_iam_role" "github_actions" {
  name = "deployment-action"
  assume_role_policy = aws_iam_user.github_actions.arn
}

data "aws_iam_policy_document" "github_actions" {
  statement {
    sid   = "WICDeploymentAssumeRole"
    actions = ["sts:AssumeRole", "sts:TagSession"]
    principals {
      type  = "AWS"
      identifiers = [
        aws_iam_user.github_actions.arn
      ]
    }
  }
}

resource "aws_iam_role_policy_attachment" "github_actions" {
  role = aws_iam_role.github_actions.name
  arn  = aws_iam_policy.github_actions.arn
}

# add ecr perms (push)
data "aws_iam_role_policy_document" "github_actions" {
 statement {
    sid   = "WICUpdateECR"
    actions = ["ecs:UpdateCluster", "ecs:UpdateService", "ecr:*"]
    principals {
      type  = "AWS"
      identifiers = [
        aws_iam_user.github_actions.arn
      ]
    }
  } 
}

resource "aws_iam_policy" "github_actions" {
  name = "wic-mt-deploy"
  policy = data.aws_iam_role_policy_document.github_actions
}