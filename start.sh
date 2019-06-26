sh mysql-docker/start-mysql-docker.sh
docker build -t project .
docker run --rm --link mysql-server -p 8080:8080 -p 8088:8088 -e "NODE_ENV=production" project