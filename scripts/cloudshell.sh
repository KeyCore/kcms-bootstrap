#!/bin/bash

set -e

mkdir "${PWD}/.npm-packages"

sudo npm install --user npm@latest yarn
npm config set cache $PWD/npm-cache
yarn config set cache-folder $PWD/yarn-cache
yarn install

aws_account_id=$(aws sts get-caller-identity --query Account --output text)
aws_region=$AWS_DEFAULT_REGION

echo "Bootstrapping $aws_account_id/$aws_region"
yarn cdk:bootstrap $aws_account_id/$aws_region
yarn kcms:bootstrap

cd $HOME
sudo rm -rf /home/bootstrap-stack
