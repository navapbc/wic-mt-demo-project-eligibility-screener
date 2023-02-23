# This is for the ECS tasks
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_ecr_repository" "app" {
  name = var.image_repository_name
}


locals {
  alb_name                = var.service_name
  cluster_name            = var.service_name
  log_group_name          = "service/${var.service_name}"
  task_executor_role_name = "${var.service_name}-task-executor"
  image_url               = "${data.aws_ecr_repository.app.repository_url}:${var.image_tag}"
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


#######################
## Service Execution ##
#######################

resource "aws_ecs_service" "app" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.cluster.arn
  launch_type     = "FARGATE"
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_instance_count

  # Allow changes to the desired_count without differences in terraform plan.
  # This allows autoscaling to manage the desired count for us.
  lifecycle {
    ignore_changes = [desired_count]
  }

  network_configuration {
    # TODO(https://github.com/navapbc/template-infra/issues/152) set assign_public_ip = false after using private subnets
    assign_public_ip = true
    subnets          = var.subnet_ids
    security_groups  = [aws_security_group.app.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api_tg.arn
    container_name   = var.service_name
    container_port   = var.container_port
  }
}

resource "aws_ecs_task_definition" "app" {
  family             = var.service_name
  execution_role_arn = aws_iam_role.task_executor.arn

  # when is this needed?
  # task_role_arn      = aws_iam_role.api_service.arn
  container_definitions = templatefile(
    "${path.module}/container-definitions.json.tftpl",
    {
      service_name   = var.service_name
      image_url      = local.image_url
      container_port = var.container_port
      cpu            = var.cpu
      memory         = var.memory
      awslogs_group  = aws_cloudwatch_log_group.service_logs.name
      aws_region     = data.aws_region.current.name
    }
  )

  cpu    = var.cpu
  memory = var.memory

  requires_compatibilities = ["FARGATE"]

  # Reference https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html
  network_mode = "awsvpc"
}

resource "aws_ecs_cluster" "cluster" {
  name = local.cluster_name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

##########
## Logs ##
##########

# Cloudwatch log group to for streaming ECS application logs.
resource "aws_cloudwatch_log_group" "service_logs" {
  name = local.log_group_name

  # Conservatively retain logs for 5 years.
  # Looser requirements may allow shorter retention periods
  retention_in_days = 1827

  # TODO(https://github.com/navapbc/template-infra/issues/164) Encrypt with customer managed KMS key
  # checkov:skip=CKV_AWS_158:Encrypt service logs with customer key in future work
}

####################
## Access Control ##
####################

resource "aws_iam_role" "task_executor" {
  name               = local.task_executor_role_name
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_task_executor_role.json
}

data "aws_iam_policy_document" "ecs_assume_task_executor_role" {
  statement {
    sid = "ECSTaskExecution"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "task_executor" {
  # Allow ECS to log to Cloudwatch.
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams"
    ]
    resources = ["${aws_cloudwatch_log_group.service_logs.arn}:*"]
  }

  # Allow ECS to authenticate with ECR
  statement {
    sid = "ECRAuth"
    actions = [
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }

  # Allow ECS to download images.
  statement {
    sid = "ECRPullAccess"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
    ]
    resources = [data.aws_ecr_repository.app.arn]
  }
}

# Link access policies to the ECS task execution role.
resource "aws_iam_role_policy" "task_executor" {
  name   = "${var.service_name}-task-executor-role-policy"
  role   = aws_iam_role.task_executor.id
  policy = data.aws_iam_policy_document.task_executor.json
}

###########################
## Network Configuration ##
###########################

# ---------------------------------------
#
# Security Groups
#
# ---------------------------------------
resource "aws_security_group" "allow-screener-traffic" {
  name       = "${var.environment_name}_allow_screener_traffic"
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

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group" "allow-lb-traffic" {
  name        = "${var.environment_name}_screener_load_balancer_sg"
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

  lifecycle {
    create_before_destroy = true
  }
}

###########################
## Database Configuration ##
###########################
resource "aws_rds_cluster" "postgresql" {
  # checkov:skip=CKV2_AWS_27:have concerns about sensitive data in logs; want better way to get this information
  # checkov:skip=CKV2_AWS_8:TODO add backup selection plan using tags
  cluster_identifier = var.service_name
  engine             = "aurora-postgresql"
  engine_mode        = "provisioned"
  database_name      = replace("${var.service_name}", "-", "_")
  master_username    = "app_usr"
  master_password    = aws_ssm_parameter.random_db_password.value
  storage_encrypted  = true
  # checkov:skip=CKV_AWS_128:IAM Auth will be added with the `wic-prp-eng` role created in PRP-74 https://wicmtdp.atlassian.net/browse/PRP-74
  # checkov:skip=CKV_AWS_162:IAM Auth will be added with the `wic-prp-eng` role created in PRP-74 https://wicmtdp.atlassian.net/browse/PRP-74
  # iam_database_authentication_enabled = true
  deletion_protection = true
  final_snapshot_identifier = "${var.service_name}-final"


  serverlessv2_scaling_configuration {
    max_capacity = 1.0
    min_capacity = 0.5
  }

}

resource "aws_rds_cluster_instance" "postgresql-cluster" {
  cluster_identifier         = aws_rds_cluster.postgresql.id
  instance_class             = "db.serverless"
  engine                     = aws_rds_cluster.postgresql.engine
  engine_version             = aws_rds_cluster.postgresql.engine_version
  auto_minor_version_upgrade = true
  monitoring_role_arn        = aws_iam_role.rds_enhanced_monitoring.arn
  monitoring_interval        = 30
}

resource "random_password" "random_db_password" {
  length           = 48
  special          = true
  min_special      = 6
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_ssm_parameter" "random_db_password" {
  name  = "/metadata/db/admin-password"
  type  = "SecureString"
  value = random_password.random_db_password.result
}

################################################################################
# Backup Configuration
################################################################################

resource "aws_backup_plan" "postgresql" {
  name = "${var.service_name}_backup_plan"

  rule {
    rule_name         = "${var.service_name}_backup_rule"
    target_vault_name = "${var.service_name}-vault"
    schedule          = "cron(0 12 ? * SUN *)"
  }
}

# create backup vault
resource "aws_backup_vault" "postgresql" {
  name = "${var.service_name}-vault"
}

# create IAM role
resource "aws_iam_role" "postgresql_backup" {
  name_prefix        = "aurora-backup-"
  assume_role_policy = data.aws_iam_policy_document.postgresql_backup.json
}

resource "aws_iam_role_policy_attachment" "postgresql_backup" {
  role       = aws_iam_role.postgresql_backup.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
}

data "aws_iam_policy_document" "postgresql_backup" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]

    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["backup.amazonaws.com"]
    }
  }
}
# backup selection
resource "aws_backup_selection" "postgresql_backup" {
  iam_role_arn = aws_iam_role.postgresql_backup.arn
  name         = "${var.service_name}-backup"
  plan_id      = aws_backup_plan.postgresql.id

  resources = [
    aws_rds_cluster.postgresql.arn
  ]
}

################################################################################
# IAM role for enhanced monitoring
################################################################################

resource "aws_iam_role" "rds_enhanced_monitoring" {
  name_prefix        = "aurora-enhanced-monitoring-"
  assume_role_policy = data.aws_iam_policy_document.rds_enhanced_monitoring.json
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

data "aws_iam_policy_document" "rds_enhanced_monitoring" {
  statement {
    actions = [
      "sts:AssumeRole",
    ]

    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["monitoring.rds.amazonaws.com"]
    }
  }
}

################################################################################
# Parameters for Query Logging
################################################################################

resource "aws_rds_cluster_parameter_group" "rds_query_logging" {
  name        = var.service_name
  family      = "aurora-postgresql13"
  description = "Default cluster parameter group"

  parameter {
    name  = "log_statement"
    value = "all" # ddl for template; none for wic
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "1"
  }
}

################################################################################
# IAM role for user access
################################################################################
resource "aws_iam_policy" "db_access" {
  name        = "wic-prp-db-access"
  description = "Allows access to the database instance"
  policy      = data.aws_iam_policy_document.db_access.json
}

data "aws_iam_policy_document" "db_access" {
  statement {
    effect = "Allow"
    actions = [
      "rds:CreateDBInstance",
      "rds:ModifyDBInstance",
      "rds:CreateDBSnapshot"
    ]
    resources = [aws_rds_cluster.postgresql.arn]
  }

  statement {
    effect = "Allow"
    actions = [
      "rds:Describe*"
    ]
    resources = [aws_rds_cluster.postgresql.arn]
  }
  
  statement {
    effect = "Allow"
    actions = [
      "rds:AddTagToResource"
      ]
    resources = [aws_rds_cluster_instance.postgresql-cluster.arn]
  }
}
