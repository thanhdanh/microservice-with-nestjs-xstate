variable "aws_region" {
  description = "AWS region to launch servers."
  default     = "ap-southeast-1a"
}

variable "key_name" {
  description = "Desired name of AWS key pair."
  default     = "foo"
}

variable "private_key_path" {
  description = "Path to the SSH private key to be used for authentication."
}

variable "public_key_path" {
  description = "Path to the SSH public key to be used for authentication."
}
