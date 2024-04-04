FROM node:18

# Define environment variables
ENV DATABASE_URL="postgresql://postgres:docker@postgres:5432/nest-js"
ENV SHADOW_DATABASE_URL="postgresql://postgres:docker@postgres:5432/nest-js-shadow"

WORKDIR /app

COPY prisma ./

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

CMD [ "npm", "run", "start:dev" ]