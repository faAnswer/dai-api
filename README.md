# Nest Starter

## Description
framework for building efficient and scalable server-side applications.

## Installation

```bash
$ npm install
```

## Running the app in development mode

```bash
$ npm run dev
```

## Running the app in production mode

```bash
$ npm run start:prod
```

## Deploy Script

frontend
```
cd [FRONTEND ROOT]
curl https://projects20.vioo.com.hk/daiwa/frontend/node_modules.zip --output node_modules.zip
unzip node_modules.zip
npm run build:docker
```

backend
```
cd [BACKEND ROOT]
curl https://projects20.vioo.com.hk/daiwa/backend/node_modules.zip --output node_modules.zip
unzip node_modules.zip
npm run build:docker
npm run docker:up
```

# Docker Deploy flow

## Step 1

### Build the docker image:

<br />

frontend
```
cd [FRONTEND ROOT]
npm run build:docker
docker build -t daiwa-analytics-platform-httpd dockerfiles/httpd
```

backend
```
cd [BACKEND ROOT]
npm run build:docker
docker build -t daiwa-analytics-platform-node dockerfiles/node
```

<br />

### Build the docker image from the container [optional]:

<br />

List all docker container
```
docker ps -a
```

frontend:
```
docker commit [container_id]  daiwa-analytics-platform-httpd
```

backend:
```
docker commit [container_id]  daiwa-analytics-platform-node
```

## Step 2

### Compress the docker image:

<br />

frontend:
```
docker save daiwa-analytics-platform-httpd > daiwa-analytics-platform-httpd.tar
```

backend:
```
docker save daiwa-analytics-platform-node > daiwa-analytics-platform-node.tar
```

<br />

## Step 3

### Load the docker image into new server:

<br />

frontend:
```
docker load --input daiwa-analytics-platform-httpd.tar
```

backend:
```
docker load --input daiwa-analytics-platform-node.tar
```

## Step 4

### Run the dockers:

```
docker-compose up
```
