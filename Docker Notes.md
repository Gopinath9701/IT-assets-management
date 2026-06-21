Docker Notes (Practical Guide)
1. Introduction to Docker
What is Docker?
Docker is a containerization platform used to package applications and their dependencies into lightweight containers that can run consistently on any machine.
Why Docker?
•	Eliminates "Works on my machine" problems.
•	Easy deployment.
•	Lightweight compared to Virtual Machines.
•	Fast startup.
•	Better resource utilization.
Docker Architecture
Developer
    ↓
Dockerfile
    ↓
Docker Image
    ↓
Docker Container
Key Components
Docker Engine
The core service that creates and manages containers.
Docker Image
A read-only template used to create containers.
Docker Container
A running instance of a Docker image.
Docker Hub
A cloud repository used to store Docker images.
________________________________________
2. Docker Installation and Basic Commands
Check Docker Version
docker --version
Check Docker Information
docker info
List Images
docker images
List Running Containers
docker ps
List All Containers
docker ps -a
Download Image
docker pull nginx
Run Container
docker run nginx
Run in Background
docker run -d nginx
Stop Container
docker stop <container_id>
Start Container
docker start <container_id>
Remove Container
docker rm <container_id>
Remove Image
docker rmi <image_name>
________________________________________
3. Dockerfile
What is a Dockerfile?
A Dockerfile is a text file containing instructions used to build a Docker image.
Example Dockerfile for PHP
FROM php:8.2-apache

COPY . /var/www/html/

EXPOSE 80
Important Dockerfile Commands
FROM
Specifies the base image.
FROM ubuntu
COPY
Copies files from host to image.
COPY . /app
WORKDIR
Sets working directory.
WORKDIR /app
RUN
Executes commands during image build.
RUN apt-get update
CMD
Default command when container starts.
CMD ["apache2-foreground"]
EXPOSE
Documents container port.
EXPOSE 80
Build Image
docker build -t myapp .
Verify Image
docker images
________________________________________
4. Docker Containers and Networking
Create Container
docker run -d -p 8080:80 myapp
Port Mapping
Host Port : Container Port
8080      : 80
Application URL:
http://localhost:8080
Container Logs
docker logs container_name
Enter Container
docker exec -it container_name bash
View Files Inside Container
ls /var/www/html
Inspect Container
docker inspect container_name
Docker Network
Create network:
docker network create mynetwork
View networks:
docker network ls
________________________________________
5. Docker Volumes, Docker Hub and Docker Compose
Docker Volumes
Volumes provide persistent storage.
Create Volume:
docker volume create myvolume
Use Volume:
docker run -v myvolume:/data nginx
List Volumes:
docker volume ls
Docker Hub
Docker Hub is used to store images online.
Login
docker login
Tag Image
docker tag myapp username/myapp:v1
Push Image
docker push username/myapp:v1
Pull Image
docker pull username/myapp:v1
________________________________________
Docker Compose
Docker Compose manages multiple containers.
Example
services:
  web:
    image: nginx
    ports:
      - "8080:80"

  mysql:
    image: mysql
Start Compose
docker compose up -d
Stop Compose
docker compose down
________________________________________
Docker Interview Questions
What is Docker?
Docker is a containerization platform used to package applications and dependencies into portable containers.
Difference Between Docker and Virtual Machine?
Docker	Virtual Machine
Lightweight	Heavy
Shares Host OS	Separate OS
Fast Startup	Slow Startup
Less Memory	More Memory
What is Docker Image?
A read-only template used to create containers.
What is Docker Container?
A running instance of a Docker image.
What is Dockerfile?
A file containing instructions to build a Docker image.
What is Docker Hub?
An online repository for storing Docker images.
What is Docker Compose?
A tool for managing multiple containers using a YAML file.
What is a Volume?
Persistent storage used by containers.
What is Port Mapping?
Host Port : Container Port
8081      : 80
Docker Workflow
Code
 ↓
Dockerfile
 ↓
Docker Build
 ↓
Docker Image
 ↓
Docker Run
 ↓
Docker Container
 ↓
Deployment
Real Project Example (Digital Voting)
PHP Project
 ↓
Dockerfile
 ↓
docker build -t digital-voting .
 ↓
docker run -d -p 8081:80 digital-voting
 ↓
Application Running

