FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /

COPY package*.json ./

# If you are building your code for production
RUN npm install --production

COPY . .

EXPOSE 8080

CMD ["npx", "ts-node-esm", "index.ts"]