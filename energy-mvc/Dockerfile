FROM node:16
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
ENV PORT=3000

ENV DB_USER=postgres

ENV DB_PORT=5432

ENV DB_HOST=tour-de-france-db

ENV DB_PASSWORD=docker

ENV DB_NAME=tour-de-france
EXPOSE 3000
CMD ["node", "index.js"]






