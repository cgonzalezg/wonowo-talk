FROM node:6.9.1
WORKDIR /app
COPY package.json /app/
RUN npm install -g swagger
RUN npm install
ENV COMPOSE=1
COPY . /app
CMD [ "npm", "start"]
