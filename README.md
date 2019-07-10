<h1 align="center">
  <br>
  <img src="/src/view/public/Images/black-logo.png" alt="VideoChat" width="400">
  <br>
  Sharing the video experience, live
  <br>
  <br>
</h1>

---------------------
## SFU CMPT 470 FINAL PROJECT
### By Cody Coombes, Andy Chen, and Jessie Leung 

## About
VideoChat is a full-stack web information system powered by ExpressJS and React. It uses <a scr="https://babeljs.io/">Babel</a> to trans-compile the latest JavaScript syntax into regular JavaScript. It offers browser backward compatibility up to IE8. We decided to use Docker as our configuration management tool. It let us run Nginx, MySQL, and project docker containers inside a virtual machine using Vagrant.

#### Features
* Drag and drop video files to browser to upload
* Store video to file system and database using post upload api
* FFMPEG integration to generate video icon
* Pipe video stream file as partial chunk through stream api
* Integrate VideoJS media player as React component to stream and control videos
* Chatroom integration with websocket to allow users to send message while watching the same video
* Sync video stream with websocket
* Video permission handling and management
* Video genre
* User history tracking
* Comment module where users can leave comments on a specific video
* User login, registration, authentication, profiles
* Group integration to allow users to upload videos
* Group permission and invite
* Group management
* Recommended videos
* Video rating
* Production ready environment with Nginx and MySQL servers
* Database schema with Sequelize

#### Database Schema
Please visit our wiki page to see our [database schema](https://github.com/codycoombes/VideoChat/wiki/database).

#### API routes
Please visit our wiki page to see our [api](https://github.com/codycoombes/VideoChat/wiki/api).

#### Issues
Websocket only works on the same browser with multiple tabs. When opened two different browsers, websocket doesn't sync well.

#### Default Users
```ruby
username: user1, password: test
username: user2, password: test
username: user3, password: test
```

---------------------------
## Installation Instruction

#### Vagrant
Please install vagrant at <a href="https://www.vagrantup.com/">https://www.vagrantup.com/</a>. Run the script below to build and start the project.

Run with `vagrant up`. Please note application may take up to <b>a few minutes</b> before being visible at <a href="http://localhost">http://localhost:8080</a>. This is because application will need to transcompile ES6 and ReactJS.

#### Docker
Please install Docker at <a href="https://www.docker.com/">https://www.docker.com/</a>. Run the script below to build and start Docker Container. Application will be visible at <a href="http://localhost">http://localhost:8080</a>.

Run with `sh start.sh`. This will build the Docker Containers for both MySQL and the main project.

#### Linux, MacOS, Windows and MySQL setup
Please refer to [how-to-setup](https://github.com/codycoombes/VideoChat/wiki/how-to-set-up) for alternative installation
