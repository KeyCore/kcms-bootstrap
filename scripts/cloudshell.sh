#!/bin/bash

set -e

if [! -d "bootstrap-stack" ] 
    echo "Error: Directory bootstrap-stack does not exists, please cd into kcms-bootstrap directory and run this script again."
    exit 1
fi

sudo cp -pr bootstrap-stack /home
cd /home/bootstrap-stack

sudo npm install -g npm@latest yarn

npm config set cache /home/bootstrap-stack/npm-cache
yarn config set cache-folder /home/bootstrap-stack/npm-cache

yarn install

aws_account_id=$(aws sts get-caller-identity --query Account --output text)
aws_region=$AWS_DEFAULT_REGION

echo "Bootstrapping $aws_account_id/$aws_region"
yarn cdk:bootstrap $aws_account_id/$aws_region
yarn kcms:bootstrap

cd $HOME
rm -rf /home/bootstrap-stack
