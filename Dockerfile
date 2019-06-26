FROM node:8.0.0-alpine
RUN apk update && apk upgrade && apk add ffmpeg
RUN mkdir -p usr/src
WORKDIR /usr/src/
RUN mkdir project
WORKDIR /usr/src/project
COPY package.json /usr/src/project
RUN npm install
COPY . /usr/src/project
WORKDIR src/
ENTRYPOINT [ "npm", "start" ]