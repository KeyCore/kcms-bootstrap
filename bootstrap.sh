#!/bin/bash

#!/bin/bash

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

    sudo npm install -g npm@latest
    npm config set cache $PWD/npm-cache
    npm install

    aws_account_id=$(aws sts get-caller-identity --query Account --output text)
    aws_region=$AWS_DEFAULT_REGION

    echo "Bootstrapping $aws_account_id/$aws_region"
    npm run cdk:bootstrap $aws_account_id/$aws_region
    npm run kcms:bootstrap -- --context service-account=2233
}

# Check if no arguments were passed
if [ $# -eq 0 ]; then
    display_usage
    exit 1
fi


# Loop over all arguments
for arg in "$@"
do
    case $arg in
        -s|--service-account)
            run_bootstrapping
            shift
            ;;
        *)
            echo "Invalid option $arg"
            display_usage
            exit 1
            ;;
    esac
done