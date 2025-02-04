# Mac
### MinIO
* On your terminal at home directory ```if you don't know where?``` just run 
 ```
 $ cd $HOME
 ```   
* Then run following command:
```
$ mkdir -p ${HOME}/minio/data
```
This will create a directory that will be bind mount to minio container for file storage  
  
* Run following command to start MinIO container:
```
$ docker compose -f docker-compose.local.yaml up -d
```
make sure port ```9000``` and ```9001``` are avaiable you machine 

### Web
Assume you already have ```Rails 8``` and ```Ruby 3.3.6```
* On your terminal at project directory  
run this command to ```install gem``` used by this project
```
$ bundle install
```
* continue later I got lazy....