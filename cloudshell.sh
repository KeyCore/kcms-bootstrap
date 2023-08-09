#!/bin/bash

set -e

sudo mkdir /home/kcms
sudo chown -R cloudshell-user:cloudshell-user /home/kcms
cd /home/kcms
sudo npm install -g npm@latest
npm config set cache $PWD/npm-cache
git clone https://github.com/KeyCore/kcms-bootstrap.git
cd kcms-bootstrap
