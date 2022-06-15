# anything relating to the creation or content of s3 buckets go here

# bucket for hosting
resource "aws_s3_bucket" "wic_mt_host_bucket" {
  bucket = "wic-mt-site-builds"
}

# encrypt data
resource "aws_s3_bucket_server_side_encryption_configuration" "wic_mt" {
  bucket = aws_s3_bucket.wic_mt_host_bucket.bucket
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
      }
    }
  }

# block public access
resource "aws_s3_bucket_public_access_block" "wic_mt_host" {
  bucket = aws_s3_bucket.wic_mt_host_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# create iam policy for bucket
# todo: update the policy document
data "aws_iam_policy_document" "wic_mt_host_policy" {
  statement {
    sid = "AllowListBucket"
    actions = [ 
      "s3:ListAllMyBuckets",
      "s3:GetBucketLocation" 
      ]
    resources = [ "arn:aws:s3:::${aws_s3_bucket.wic_mt_host_bucket}" ]
  }
}

# add policy to bucket
resource "aws_bucket_policy" "wic_mt_host_bucket"{
  bucket = aws_s3_bucket.wic_mt_host_bucket.id
  policy = data.aws_iam_policy_document.wic_mt_host_policy.json
}
