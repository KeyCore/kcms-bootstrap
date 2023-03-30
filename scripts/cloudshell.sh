#!/bin/bash

set -e

sudo mv bootstrap-stack /home
cd /home/bootstrap-stack

sudo npm install -g npm@latest yarn
yarn install

aws_account_id=$(aws sts get-caller-identity --query Account --output text)
aws_region=$AWS_DEFAULT_REGION

echo "Bootstrapping $aws_account_id/$aws_region"
yarn cdk:bootstrap $aws_account_id/$aws_region
yarn kcms:bootstrap