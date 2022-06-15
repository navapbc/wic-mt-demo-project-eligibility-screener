# configuration for ECS Fargate should go here
# resource "aws_ecs_task_definition" "eligibility_screener_task" {
  
# }

# resource "aws_ecs_service" "eligibility_screener_service" {
#   name = "eligibility_screener_service"
#   task_definition = aws_ecs_task_definition.eligibility_screener_task
#   cluster = "" # not sure this is needed
#   launch_type = "FARGATE"
#   iam_role = "" # role needs to be created so that the task doesn't need to be manually triggered
  
# }

