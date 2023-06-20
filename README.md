# KeyCore Managed Services Bootstrap helper

To bootstrap an account, simply clone this repository and execute the boostrap.sh script.

The script takes a --service-account argument, this has tp be the keycore service account number.
This account id will be provided during the onboarding process

Please note that this project will require that nnodejs min v18 is installed and valid AWS credentials in the terminal.

Normally this can be executed in cloudshell, but please be aware that the current state will require more storage than what is assigned to the /home/cloud-user storage, a workarround can be to use another volume:


In the cloudshell type:
`df -H`
find the +10 GB volume and create a temporary directory, change ownership to cloudshell-user and clone into this folder and execute the  bootstrap.sh script
