FROM ubuntu

RUN apt-get update

RUN apt-get install npm -y

COPY . /opt/my-app

WORKDIR /opt/my-app

RUN npm install



CMD ["npm", "start"] 