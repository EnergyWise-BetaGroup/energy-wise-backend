FROM node:16
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
ENV PORT=3000

ENV DB_USER=postgres

ENV DB_PORT=5432

ENV DB_HOST=energy-db

ENV DB_PASSWORD=docker

ENV DB_NAME=energy-db

ENV SECRET_TOKEN=awiouerv902387vb90p2834vun08934v5ukljasdcl1

EXPOSE 3000
CMD ["node", "index.js"]






