# This bucket should hold the state for terraform

# bucket for hosting
resource "aws_s3_bucket" "wic_mt_tf_state" {
  bucket = "wic-mt-tf-state"
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

resource "aws_iam_role" "wic_mt_bucket_management" {
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
resource "aws_iam_policy" "wic_mt_tf_state_policy" {
  name = "tf_state_policy"
  path = "/"
  policy = data.aws_iam_policy_document.wic_mt_tf_state_policy.json
}
# add policy to bucket
resource "aws_s3_bucket_policy" "wic_mt_tf_state_bucket"{
  bucket = aws_s3_bucket.wic_mt_tf_state_bucket.id
  policy = aws_iam_policy.wic_mt_tf_state_policy.json
}
