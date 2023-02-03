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
# Security Groups
#
# ---------------------------------------
resource "aws_security_group" "allow-screener-traffic" {
  name        = "allow_screener_traffic"
  description = "This rule blocks all traffic unless it is HTTPS for the eligibility screener"
  vpc_id      = module.constants.vpc_id

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow traffic from internet"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
  }
  egress {
    description      = "allow all outbound traffic from screener"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group" "allow-lb-traffic" {
  name        = "screener_load_balancer_sg"
  description = "Allows load balancers to communicate with tasks"
  vpc_id      = module.constants.vpc_id

  ingress {
    description      = "HTTP traffic from anywhere"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  ingress {
    description      = "HTTPS traffic from anywhere"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  egress {
    description      = "allow all outbound traffic from load balancer"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

# ---------------------------------------
#
# Load Balancing
#
# ---------------------------------------

resource "aws_lb" "eligibility-screener" {
  name               = "${var.environment_name}-screener-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow-lb-traffic.id]
  subnets = [
    "subnet-05b0618f4ef1a808c",
    "subnet-06067596a1f981034",
    "subnet-06b4ec8ff6311f69d",
    "subnet-08d7f1f9802fd20c4",
    "subnet-09c317466f27bb9bb",
    "subnet-0ccc97c07aa49a0ae"
  ] # find a way to map all the default ones here; hardcoding for now
  ip_address_type        = "ipv4"
  desync_mitigation_mode = "defensive"
}

resource "aws_lb_target_group" "eligibility-screener" {
  name        = "${var.environment_name}-screener-lb"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = module.constants.vpc_id
  health_check {
    enabled = true
    port    = 3000
  }
}

resource "aws_lb_listener" "screener_secure" {
  load_balancer_arn = aws_lb.eligibility-screener.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "arn:aws:acm:us-east-1:546642427916:certificate/91022588-849d-4b53-8ad1-b649607795ae"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.eligibility-screener.arn
  }
}

resource "aws_lb_listener" "screener" {
  load_balancer_arn = aws_lb.eligibility-screener.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
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
