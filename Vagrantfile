Vagrant.configure("2") do |config|
	
  # Virtual Machine
  config.vm.box = "ubuntu/trusty64"

  # Ports
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 8088, host: 8088


  # VirtualBox
  cpus = "1"
  memory = "1024" # MB
  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--cpus", cpus, "--memory", memory]
    vb.customize ["modifyvm", :id, "--uartmode1", "disconnected"] # speed up boot https://bugs.launchpad.net/cloud-images/+bug/1627844
    #vb.gui = true
  end
 
  # Docker
  config.vm.provision "docker" do |d|
    d.run "mysql:5.7", args: "--name mysql-server -e MYSQL_ROOT_PASSWORD=cmpt470 -e MYSQL_DATABASE=testdb -p 3306:3306"
    d.build_image "/vagrant", args: "-t project"
    d.run "project", args: "--name project-server --link mysql-server -p 8080:8080 -p 8088:8088 -e 'NODE_ENV=production'"
    d.build_image "/vagrant/nginx-docker", args: "-t nginx"
    d.run "nginx", args: "--name nginx-server --link project-server -p 80:80"
	end

end
