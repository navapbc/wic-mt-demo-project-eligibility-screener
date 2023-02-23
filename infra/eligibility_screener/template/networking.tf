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
# copy over everything in the template-infra repository in here. Have the current infra match what's in the template
# e.g. the Makefile and the bin folder
# use the image_tag file from the template here
# do some desk research on template-infra. Tell Rocket what they're doing and why
# use as much of the template as possible 
# make a list of new things, and compare them to what we currently have

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