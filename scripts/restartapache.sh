#!/bin/bash

log=/var/log/deploy/angular-yourbook.log

echo 'exec restartapache.sh' |& sudo tee $log

aws ecr get-login-password --region eu-west-3 | sudo docker login --username AWS --password-stdin 498746666064.dkr.ecr.eu-west-3.amazonaws.com |& tee $log

sudo docker stop ecf-garage-front |& tee -a $log
sudo docker rm ecf-garage-front |& tee -a $log

sudo docker image rm 498746666064.dkr.ecr.eu-west-3.amazonaws.com/ecf-garage-front:latest

sudo docker pull 498746666064.dkr.ecr.eu-west-3.amazonaws.com/ecf-garage-front:latest |& tee -a $log
sudo docker run -p 443:443 -d --name ecf-garage-front 498746666064.dkr.ecr.eu-west-3.amazonaws.com/ecf-garage-front |& tee -a $log
