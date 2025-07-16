resource "aws_s3_bucket" "example" {
  bucket = "my-tf-test-bucket-nai9019"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}