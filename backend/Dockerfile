FROM node:18

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
