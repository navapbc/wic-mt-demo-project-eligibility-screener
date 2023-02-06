# ---------------------------------------
#
# Locals
#
# ---------------------------------------
locals {
  container_name = "${var.environment_name}-eligibility-screener-container"
}

# ---------------------------------------
#
# ECS
#
# ---------------------------------------
resource "aws_ecs_cluster" "eligibility-screener-ecs-cluster" {
  name = var.environment_name
}

resource "aws_ecs_service" "eligibility-screener-ecs-service" {
  name            = "${var.environment_name}-screener-ecs-service"
  cluster         = aws_ecs_cluster.eligibility-screener-ecs-cluster.id
  task_definition = aws_ecs_task_definition.eligibility-screener-ecs-task-definition.arn
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = ["subnet-06b4ec8ff6311f69d"]
    assign_public_ip = true
    security_groups  = [aws_security_group.allow-screener-traffic.id]
  }
  desired_count = 1

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
  force_new_deployment = true

  load_balancer {
    target_group_arn = aws_lb_target_group.eligibility-screener.arn
    container_name   = local.container_name # from the task definition 
    container_port   = 3000                 # from the exposed docker container on the screener
  }
}
data "aws_cloudwatch_log_group" "eligibility_screener" {
  name = "screener"
}
data "aws_ssm_parameter" "random_api_key" {
  name = "/common/mock_api_db/API_AUTH_TOKEN"
}

resource "aws_ecs_task_definition" "eligibility-screener-ecs-task-definition" {
  family                   = "${var.environment_name}-screener-task-definition"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  memory                   = "1024"
  cpu                      = "512"
  execution_role_arn       = "arn:aws:iam::546642427916:role/wic-mt-task-executor"
  container_definitions = jsonencode([
    {
      name      = local.container_name
      image     = "546642427916.dkr.ecr.us-east-1.amazonaws.com/eligibility-screener-repo:latest-${var.environment_name}"
      memory    = 1024
      cpu       = 512
      essential = true
      portMappings = [
        {
          containerPort : 3000
        }
      ],
      environment : [
        {
          "name" : "API_HOST"
          "value" : "http://test-mock-api-lb-2033452615.us-east-1.elb.amazonaws.com:80" # hardcoded for persistience, mockapi load balancer DNS name
        },
        {
          "name" : "API_AUTH_TOKEN"
          "value" : "${data.aws_ssm_parameter.random_api_key.value}"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = "${data.aws_cloudwatch_log_group.eligibility_screener.name}",
          "awslogs-region"        = "us-east-1",
          "awslogs-stream-prefix" = "screener"
        }
      }
    }
  ])
}
