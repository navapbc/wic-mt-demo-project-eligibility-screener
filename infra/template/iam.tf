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
  assume_role_policy = ""
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

