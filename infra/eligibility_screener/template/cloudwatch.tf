# ----------------------------------------------
# Eligibility Screener
# ----------------------------------------------
resource "aws_cloudwatch_log_group" "eligibility_screener" {
  name              = "screener-${var.environment_name}"
  retention_in_days = 90
}