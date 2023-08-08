#!/bin/bash

set -e

# Function to display usage
display_usage() {
    echo "Usage: $0 [-s|--service-account]"
    echo
    echo "   -s, --service-account     service account argument"
}

# Function to handle service account argument
run_bootstrapping() {
    service_account=$1
    echo "Service account: $service_account"

    npm install

    aws_account_id=$(aws sts get-caller-identity --query Account --output text)
    aws_region=$AWS_DEFAULT_REGION

    echo "Bootstrapping $aws_account_id/$aws_region"
    npm run cdk:bootstrap $aws_account_id/$aws_region
    npm run synth -- --context service-account=$service_account
    npm run cdk deploy -- --require-approval never --context service-account=$service_account
}

# Check if no arguments were passed
if [ $# -eq 0 ]; then
    display_usage
    exit 1
fi

# Loop over all arguments
while (( "$#" )); do
  case "$1" in
    -s|--service-account)
      if [ -n "$2" ] && [ ${2:0:1} != "-" ]; then
        run_bootstrapping "$2"
        shift 2
      else
        echo "Error: Argument for $1 is missing" >&2
        display_usage
        exit 1
      fi
      ;;
    *)
      echo "Invalid option: $1" >&2
      display_usage
      exit 1
      ;;
  esac
done