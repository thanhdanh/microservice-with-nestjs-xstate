provider "aws" {
  region = "${var.aws_region}"
}

provider "docker" {
  host = "tcp://${aws_instance.web.public_ip}:2376/"
}

resource "aws_key_pair" "auth" {
  key_name   = "${var.key_name}"
  public_key = "${file(var.public_key_path)}"
}

resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags {
    Name = "website-vpc"
  }
}