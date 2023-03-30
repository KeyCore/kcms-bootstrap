#!/bin/bash

set -e

sudo npm install -g aws-cdk@latest yarn

aws_account_id=$(aws sts get-caller-identity --query Account --output text)
aws_region=$AWS_DEFAULT_REGION
echo "Bootstrapping $aws_account_id/$aws_region"
cdk bootstrap --qualifier keycore --toolkit-stack-name KeyCoreCDKToolkit --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess $aws_account_id/$aws_region

yarn install
yarn synth
yarn deploy KCMSBootstrapStack