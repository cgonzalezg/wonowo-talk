FROM node:6.9.1
WORKDIR /app
RUN npm install -g swagger
COPY package.json /app/
RUN npm install
ENV COMPOSE=1
COPY . /app
CMD [ "npm", "start"]
