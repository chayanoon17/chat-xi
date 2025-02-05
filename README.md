# CHANGELOG

## จุดประสงค์ / วิธีการใช้งาน

### จุดประสงค์ของโปรเจ็กต์
โปรเจ็กต์นี้เป็นระบบ **Chatbot** ที่พัฒนาด้วย **AWS Bedrock**, **Next.js**, และ **TypeScript** โดยมีวัตถุประสงค์หลักคือ:
- สร้างระบบตอบกลับอัตโนมัติที่มีความแม่นยำและสามารถโต้ตอบได้แบบเรียลไทม์
- ใช้ประโยชน์จากเทคโนโลยี AI ของ AWS Bedrock เพื่อพัฒนาระบบที่สามารถรองรับคำถามซับซ้อนได้
- เพิ่มประสิทธิภาพในการแสดงผลด้วย UI ที่ใช้งานง่ายและรองรับการแสดงผล 3D

### วิธีการใช้งาน

1. **การติดตั้งและตั้งค่าโปรเจ็กต์**
   - คลิกรันคำสั่งเพื่อติดตั้งโปรเจ็กต์:
     ```bash
     git clone https://github.com/chayanoon17/chat-xi
     cd your-repo-name
     npm install
     ```
   - สร้างไฟล์ `.env.local` และตั้งค่า AWS credentials:
     ```plaintext
     AWS_ACCESS_KEY=your-access-key
     AWS_SECRET_KEY=your-secret-key
     ```
   - เริ่มต้นเซิร์ฟเวอร์ด้วยคำสั่ง:
     ```bash
     npm run dev
     ```
   - เข้าใช้งานโปรเจ็กต์ผ่านเบราว์เซอร์ที่:
     `http://localhost:3000`

2. **วิธีการใช้งานฟีเจอร์**
   - เปิดหน้าแอปพลิเคชันเพื่อเริ่มต้นโต้ตอบกับ Chatbot
   - พิมพ์คำถามหรือข้อความในกล่องข้อความ
   - ใช้ฟีเจอร์ปรับแต่ง เช่น การเลือกธีมหรือปรับแต่งโมเดล AI

3. **ฟีเจอร์ที่รองรับในเวอร์ชันปัจจุบัน**
   - **แสดงผลแบบ 3D**: ยกระดับประสบการณ์การใช้งาน
   - **UI สำหรับการสตรีมคำตอบ**: แสดงคำตอบแบบเรียลไทม์

4. **ปัญหาที่แก้ไขในเวอร์ชันนี้**
   - ปรับปรุงการแสดงผลโค้ดบล็อก
   - แก้ไขคำสั่ง Prisma generate เพื่อให้ทำงานถูกต้องระหว่าง build

## [1.0.0] - 2025-01-16

### Added
- Added 3D display feature to improve user experience. (Commit: 5ebb840)

### Changed
- Updated background for improved UI aesthetics. (Commit: 9e51cab)
- Refined UI for streaming page, including animation improvements. (Commit: 8d6719e, a697041, 485302e)

### Fixed
- Fixed issue with code block rendering. (Commit: ea9e284)
- Fixed Prisma generate command in build script. (Commit: 07c5ca5)

### Initial Setup
- Initial project setup using Create Next App. (Commit: 642be44)
- First commits to project repository. (Commits: 825b77d, 49cb62b)

