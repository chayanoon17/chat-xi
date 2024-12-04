FROM node:18-alpine

WORKDIR /app

# Copy package.json files first, to leverage Docker's cache
COPY package*.json ./
RUN npm install

# Copy .env file (make sure this file exists in the project root)
COPY .env ./

# Copy the rest of your application code
COPY . .

# Run Prisma generate and build
RUN npx prisma generate
RUN npm run build

# Start the app
CMD ["npm", "start"]
