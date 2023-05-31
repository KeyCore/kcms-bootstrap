#!/bin/bash

set -e

sudo npm install --user npm@latest
npm config set cache $PWD/npm-cache
npm install

aws_account_id=$(aws sts get-caller-identity --query Account --output text)
aws_region=$AWS_DEFAULT_REGION

echo "Bootstrapping $aws_account_id/$aws_region"
npm run cdk:bootstrap $aws_account_id/$aws_region
npm run kcms:bootstrap