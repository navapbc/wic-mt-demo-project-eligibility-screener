# configuration for ECS Fargate should go here

# Task def required for docker container
# resource "aws_ecs_task_definition" "eligibility_screener" {
#   family = "eligibility_screener"
#   container_definitions = ""
#   cpu                      = "2048"
#   memory                   = "4096"
#   requires_compatibilities = ["FARGATE"]
#   execution_role_arn = aws_iam_role.ecs_executor.arn
# }

# # Todo: Find a way to tear this down
# # resource "aws_ecs_service" "eligibility_screener_service" {
# #   name = "eligibility_screener_service"
# #   task_definition = aws_ecs_task_definition.eligibility_screener.arn
# #   cluster = aws_ecs_cluster.cluster.arn
# #   launch_type = "FARGATE"
# # }

# # cluster
# resource "aws_ecs_cluster" "cluster" {
#   name = "test"
#   setting {
#     name = "containerInsights"
#     value = "enabled"
#   }
  
# }
