FROM node:16
WORKDIR /consumer_server
COPY ["package.json", "./"]
RUN npm install
COPY . .

EXPOSE 3030
CMD ["node", "app.js"]
