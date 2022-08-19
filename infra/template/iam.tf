# ----------------------------------------------------------
# 
# IAM Roles for Users
#
# ----------------------------------------------------------
# IAM roles/users created here:
# wic-mt-github-actions: this is the user that will hold temporary credentials to AWS when the deploy action is running
# deployment-action: gives the user permission to perform all ECR services (will be narrowed down later), and Update actions for ECS

# resource "aws_iam_user" "github_actions" {
#   name = "wic-mt-github-actions"
# }
# resource "aws_iam_role" "github_actions" {
#   name = "deployment-action"
#   assume_role_policy = aws_iam_user.github_actions.arn
# }

# data "aws_iam_policy_document" "github_actions" {
#   statement {
#     sid   = "WICDeploymentAssumeRole"
#     actions = ["sts:AssumeRole", "sts:TagSession"]
#     principals {
#       type  = "AWS"
#       identifiers = [
#         aws_iam_user.github_actions.arn
#       ]
#     }
#   }
# }

# resource "aws_iam_role_policy_attachment" "github_actions" {
#   role = aws_iam_role.github_actions.name
#   policy_arn  = aws_iam_policy.deploy_action.arn
# }

# # add ecr perms (push)
# data "aws_iam_policy_document" "deploy_action" {
#  statement {
#     sid   = "WICUpdateECR"
#     actions = ["ecs:UpdateCluster", "ecs:UpdateService", "ecr:*"]
#     principals {
#       type  = "AWS"
#       identifiers = [
#         aws_iam_user.github_actions.arn
#       ]
#     }
#   } 
# }

# resource "aws_iam_policy" "deploy_action" {
#   name = "wic-mt-deploy"
#   policy = data.aws_iam_policy_document.deploy_action.json
# }