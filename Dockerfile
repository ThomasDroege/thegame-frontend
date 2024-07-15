# Dockerfile für React Frontend
FROM node:14-alpine

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
# RUN npm run build


# Stelle sicher, dass der Entwicklungsserver auf Port 3000 läuft
EXPOSE 3000
CMD ["npm", "start"]