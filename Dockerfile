FROM node:18-alpine

WORKDIR /app

# ติดตั้ง OpenSSL
RUN apk update && apk add openssl

# คัดลอกไฟล์ที่จำเป็น
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดของแอปพลิเคชัน
COPY . .

# รัน Prisma generate และ build
RUN npx prisma generate
RUN npm run build

# เริ่มแอป
CMD ["npm", "start"]
