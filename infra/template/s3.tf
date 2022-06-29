# This bucket holds the state for terraform

# bucket for hosting
resource "aws_s3_bucket" "wic_mt_tf_state" {
  bucket = "wic-mt-tf-state"
  force_destroy = true
}
# enable versioning on bucket
resource "aws_s3_bucket_versioning" "wic_mt_tf_state" {
  bucket = aws_s3_bucket.wic_mt_tf_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# encrypt data
resource "aws_s3_bucket_server_side_encryption_configuration" "wic_mt" {
  bucket = aws_s3_bucket.wic_mt_tf_state.bucket
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
      }
    }
  }

# block public access
resource "aws_s3_bucket_public_access_block" "wic_mt_tf_state" {
  bucket = aws_s3_bucket.wic_mt_tf_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


# create iam policy for bucket
data "aws_iam_policy_document" "wic_mt_tf_state_policy" {
  statement {
    sid = "AllowListBucket"
    effect = "Allow"
    principals {
      type = "AWS"
      identifiers = ["*"]
    }
    actions = [ 
      "s3:GetBucketLocation",
      "s3:GetObject",
      "s3:ListBucket",
      ]
    resources = [ aws_s3_bucket.wic_mt_tf_state.arn, "${aws_s3_bucket.wic_mt_tf_state.arn}/*" ]
  }
}

# add policy to bucket
resource "aws_s3_bucket_policy" "wic_mt_tf_state_bucket"{
  bucket = aws_s3_bucket.wic_mt_tf_state.id
  policy = data.aws_iam_policy_document.wic_mt_tf_state_policy.json
}

# enable bucket ownership controls: https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html
resource "aws_s3_bucket_ownership_controls" "wic_mt_tf_controls" {
  bucket = aws_s3_bucket.wic_mt_tf_state.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}
