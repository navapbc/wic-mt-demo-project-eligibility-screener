# configuration for ECS Fargate should go here

# Task def required for docker container
# resource "aws_ecs_task_definition" "eligibility_screener_task" {
#   family = "eligibility_screener"
#   container_definitions = ""
# }

# resource "aws_ecs_service" "eligibility_screener_service" {
#   name = "eligibility_screener_service"
#   task_definition = aws_ecs_task_definition.eligibility_screener_task.arn
#   cluster = "" # not sure this is needed
#   launch_type = "FARGATE"
#   iam_role = "" # role needs to be created so that the task doesn't need to be manually triggered
  
# }

# task execution iam role
# cluster
#security group
