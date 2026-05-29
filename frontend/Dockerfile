FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set Next.js to run on port 9800 inside the container
ENV PORT=9800
EXPOSE 9800

RUN npm run build

CMD ["npm", "run", "start"]
