FROM node:20.10.0

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

RUN npm install -g serve

EXPOSE 5002

# Command to serve the built application
CMD ["serve", "-s", "build", "-l", "5002"]
