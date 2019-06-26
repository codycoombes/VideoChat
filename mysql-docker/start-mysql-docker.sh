#!/bin/bash          
# bash script for creating a docker using officially maintained docker image
# https://hub.docker.com/_/mysql/
# port 3306

mkdir -p data

docker run --rm --name mysql-server \
	   -p 3306:3306 \
	   -v "$(pwd)"/data:/var/lib/mysql \
	   -e MYSQL_ROOT_PASSWORD=cmpt470 \
	   -e MYSQL_DATABASE=testdb \
	   -d mysql:5.7 

# get docker IP address
docker inspect mysql-server | grep IPAddress