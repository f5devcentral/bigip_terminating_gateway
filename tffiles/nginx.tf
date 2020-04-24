resource "aws_launch_configuration" "nginx" {
  name_prefix                 = "${var.prefix}-nginx-"
  image_id                    = data.aws_ami.ubuntu.id
  instance_type               = "t2.micro"
  associate_public_ip_address = true

  security_groups = [aws_security_group.nginx.id]
  key_name        = aws_key_pair.demo.key_name
  user_data       = file("../services/nginx.sh")

  iam_instance_profile = aws_iam_instance_profile.consul.name

  lifecycle {
    create_before_destroy = true
  }
}


