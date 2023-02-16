output "screener_tags" {

  value = {
    project    = "eligibility-screener"
    owner      = "wic-mt-demo"
    repository = "https://github.com/navapbc/wic-mt-demo-project-eligibility-screener"
  }
}

output "vpc_id" {
  value       = "vpc-032e680f92b88bb68"
  description = "Default VPC provided by AWS"
}