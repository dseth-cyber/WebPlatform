# ระบบเว็บไซต์องค์กรและระบบจัดการเนื้อหา (CMS)
## บริษัท ไคโอทรอน เทคโนโลยี จำกัด (CHIOTRON TECHNOLOGY CO., LTD.)

ระบบแพลตฟอร์มเว็บไซต์องค์กรระดับพรีเมียมและระบบบริหารจัดการเนื้อหา (Corporate Website & CMS Management Platform) มาตรฐานระดับสากล สำหรับ **บริษัท ไคโอทรอน เทคโนโลยี จำกัด (CHIOTRON TECHNOLOGY)** ผู้นำด้านวิศวกรรมบรรจุภัณฑ์โลหะและนวัตกรรมการผลิตมาตรฐานส่งออก (กระป๋องบรรจุอาหาร, ถังบรรจุสารเคมี, กระป๋องสเปรย์แอร์โรซอล และฝาโลหะดึงเปิดง่าย Easy-Open Ends)

พัฒนาด้วยสถาปัตยกรรมประสิทธิภาพสูง **Go 1.24+**, **Chi Router**, **PostgreSQL 16+**, **React 19**, **TypeScript**, **TailwindCSS**, **MinIO (S3 Object Storage)** และ **Docker Compose** โดยเป็นระบบ On-Premise / Self-Hosted สมบูรณ์แบบ 100% ไม่ต้องพึ่งพาบริการคลาวด์ภายนอกที่มีค่าใช้จ่ายรายเดือน (Zero Paid SaaS Dependencies)

---

## 🌟 จุดเด่นและฟังก์ชันการทำงานหลัก (Key Features)

### 1. ระบบจัดการเมนูนำทางและจัดลำดับเนื้อหาหน้าแรกแบบไดนามิก (Header & Section Dynamic Order)
- **Header Navigation Tabs Manager**: จัดการเปิด/ปิด (ซ่อนหรือแสดง) เมนูนำทางบนแถบ Header ได้อย่างอิสระ
- **Drag & Drop Reordering**: รองรับการลากเพื่อสลับลำดับเมนู หรือกดปุ่มลูกศรขึ้น/ลง เพื่อจัดเรียงลำดับใหม่
- **Dynamic Continuous Scroll**: ลำดับการเลื่อนดูเนื้อหาบนหน้าแรก (Homepage) จะเรียงลำดับสอดคล้องตามเมนูที่จัดวางแบบ Real-time ทันที
- **ลำดับเริ่มต้นมาตรฐาน**: หน้าแรก $\rightarrow$ เกี่ยวกับเรา $\rightarrow$ สินค้า $\rightarrow$ บริการ $\rightarrow$ เทคโนโลยี $\rightarrow$ ความยั่งยืน $\rightarrow$ ข่าวสาร $\rightarrow$ ติดต่อเรา $\rightarrow$ สมัครงาน

### 2. แผงควบคุมเปิด/ปิดปุ่มบนหน้าเว็บสำหรับผู้เข้าชม (Public Web Button Controls)
- **สวิตช์ซ่อน/แสดงปุ่ม Hero**: สามารถเปิด/ปิดปุ่มดำเนินการหลักบนแบนเนอร์หน้าแรกได้ทั้งสองปุ่ม
  - ปุ่มที่ 1 (สีทอง): **"อ่านประวัติองค์กร"** (Primary Action Button)
  - ปุ่มที่ 2 (โครงร่างโปร่งใส): **"ชมผลิตภัณฑ์ของเรา"** (Secondary Action Button)
- **สวิตช์ปุ่มพิเศษบน Header**:
  - ปุ่มเข้าสู่ระบบแอดมิน (`🔒 CMS`)
  - ปุ่มสลับธีมสี (`Theme Switcher`)

### 3. ฟังก์ชันปักหมุดการ์ดเด่นสู่หน้าแรก (Pin & Featured Cards to Homepage 📌)
- รองรับการปักหมุดการ์ดเนื้อหาเด่นจากแต่ละส่วนเพื่อนำมาแสดงบนหน้าแรกโดยเฉพาะ:
  - **บริการ (Services)**: ปุ่มปักหมุดบริการหลัก พร้อมป้าย `📌 แนะนำ`
  - **เทคโนโลยี (Technology)**: ปุ่มปักหมุดเครื่องจักรและนวัตกรรมหลัก พร้อมป้าย `📌 ไฮไลท์`
  - **ความยั่งยืน (Sustainability)**: ปุ่มปักหมุดเสาหลัก ESG พร้อมป้าย `📌 นโยบายหลัก`
  - **ข่าวสาร (News)**: ปุ่มปักหมุดข่าวประชาสัมพันธ์เด่น พร้อมป้าย `📌 ข่าวเด่น`
  - **หมวดหมู่สินค้า (Product Categories)**: เมนูจัดการปักหมุดและสลับเปิด/ซ่อนหมวดหมู่สินค้าหน้าแรก
- มีระบบ Fallback อัตโนมัติ: หากยังไม่มีการปักหมุด ระบบจะแสดงการ์ดเริ่มต้นให้ครบถ้วน หน้าเว็บจะไม่ว่างเปล่า

### 4. ระบบแสดงผล 3 ธีมสี พร้อมฟอนต์ Google และสี Charcoal สบายตา (Google Typography & Multi-Theme)
- **ฟอนต์มาตรฐาน Google**: ใช้งานชุดแบบอักษรทางการของ Google (`Noto Sans Thai` + `Google Sans` / `Plus Jakarta Sans`) คมชัด อ่านง่ายทุกขนาดหน้าจอ
- **Modern Cyber**: โทนสีเข้มหรูหรา ตัดด้วยเส้นขอบแสงนีออน Cyan/Amber สไตล์โรงงานอัจฉริยะล้ำสมัย
- **Dark Industrial**: โทนสีมืดสไตล์อุตสาหกรรมโลหะ เรียบหรู สบายตา
- **Clean Light (Google Material Palette)**: โทนสีสว่าง สะอาดตา สไตล์ Google Material Design ปรับปรุงสีตัวอักษรเป็น Dark Charcoal (`#202124`) และสีเทาเนเชอรัล (`#5F6368`) แทนสีดำสนิท เพื่อความสบายตา สวยงามระดับพรีเมียมตามมาตรฐานสากล พร้อมปรับแต่งเมนูและเส้นใต้สีน้ำเงิน Google Blue (`#1A73E8`) เข้าชุดกันอย่างลงตัว

### 5. ระบบจัดการสาขาและสถานที่ตั้งโรงงาน (Multi-Branch Locations Manager)
- รองรับองค์กรที่มีหลายสาขา: เพิ่ม, แก้ไข, ลบ และกำหนดสถานะสาขาหลัก (Primary HQ) ได้อย่างอิสระ
- ครอบคลุมประเภทสาขา: 🏢 สำนักงานใหญ่, 🏭 โรงงานผลิต, 📦 คลังสินค้า/ศูนย์กระจายสินค้า และ 📍 สาขาภูมิภาค
- แสดงผลบนหน้าเว็บทั้งในหน้าแรก (Homepage), หน้าติดต่อเรา (Contact Page) และส่วนท้ายเว็บ (Footer) ด้วยแท็บสลับสาขาแบบ Interactive อัปเดตที่อยู่ เบอร์โทร อีเมล เวลาทำการ และแผนที่นำทาง Google Maps แบบเรียลไทม์

### 6. การเชื่อมโยงแคตตาล็อกสินค้าจริงสู่หน้าแรก (Homepage Real Products Catalog)
- แสดงรายการสินค้าจริงที่เพิ่มไว้ใน **ADMIN PANEL • จัดการแคตตาล็อกสินค้า (Products Catalog Database)** ตรงกัน 100%
- มีระบบสลับมุมมองระหว่าง **"สินค้าแคตตาล็อก"** (พร้อมรหัส SKU, ภาพสินค้า, สเปกวัสดุ และปุ่มขอใบเสนอราคา) และ **"หมวดหมู่บรรจุภัณฑ์"**
- รองรับการปักหมุด `📌 แนะนำ` นำสินค้าเด่นขึ้นแสดงเป็นลำดับแรก

### 7. สถาปัตยกรรม 5 ภาษา (Multi-Language Architecture)
- รองรับภาษาทางการค้า 5 ภาษา:
  - 🇹🇭 ภาษาไทย (TH)
  - 🇬🇧 ภาษาอังกฤษ (EN)
  - 🇨🇳 ภาษาจีน (CN)
  - 🇲🇲 ภาษาพม่า (MM)
  - 🇯🇵 ภาษาญี่ปุ่น (JP)
- มีระบบ Fallback อัจฉริยะ (`cn/mm/jp` $\rightarrow$ `en` $\rightarrow$ `th`) ป้องกันปัญหาเนื้อหาไม่แสดงผล

### 8. คลังไฟล์สื่อและการบีบอัดรูปภาพอัจฉริยะ (Media Library & WebP Compression)
- มีระบบจัดเก็บไฟล์สื่อกลาง (Media Storage) บน MinIO S3
- ระบบ Client-Side Image Compressor บีบอัดไฟล์ภาพเป็น WebP ก่อนส่งขึ้นเซิร์ฟเวอร์โดยอัตโนมัติ ช่วยลดขนาดไฟล์และประหยัด Bandwidth
- รองรับการอัปโหลดรูปภาพครอบคลุมทุกหมวด: โลโก้, ป้ายแบนเนอร์, สินค้า, บริการ, เทคโนโลยี, ความยั่งยืน และข่าวสาร

### 9. ความปลอดภัยระดับองค์กร (Enterprise Security - Score 9.8/10)
- การเข้ารหัสรหัสผ่านด้วยอัลกอริทึม **Argon2id**
- ระบบจัดการสิทธิ์ตามบทบาท (RBAC) 3 ระดับ: `SUPER_ADMIN`, `CONTENT_EDITOR`, `PRODUCT_SPECIALIST`
- ระบบ Session จัดเก็บบน Database ปลอดภัยด้วยคุกกี้ `HttpOnly`, `SameSite=Strict`, `Secure`
- การป้องกันการโจมตี CSRF Token Synchronization
- ระบบป้องกันการยิง Request ถี่เกินกำหนด (Token Bucket Rate Limiting per IP)
- บันทึกประวัติการกระทำของผู้ใช้งานที่ไม่สามารถแก้ไขได้ (Immutable Audit Trail) พร้อม IP และ User Agent
- ระบบ Re-authentication ยืนยันรหัสผ่านอีกครั้งก่อนสั่งลบข้อมูลถาวรหรือล้างถังขยะ

---

## 🚀 การเริ่มต้นใช้งานด่วน (Quick Start via Docker)

### 1. โคลนและตั้งค่าสภาพแวดล้อม (Environment Setup)
```bash
cp .env.example .env
```

### 2. รันระบบทั้งหมดด้วย Docker Compose
```bash
docker compose up -d --build
```

### 3. รันตัวสร้างข้อมูลเริ่มต้น (Database Seeder)
```bash
docker compose exec api /app/seeder
```

### ข้อมูลเข้าสู่ระบบเริ่มต้น (Default Superadmin Credentials):
- **URL เข้าสู่ระบบ CMS**: `http://localhost/admin`
- **บัญชีผู้ใช้**: `admin@localhost.co.th`
- **รหัสผ่าน**: `AdminLohakit2026!`

---

## 🌐 พอร์ตและ URL การเข้าถึงระบบ

| บริการ (Service) | URL การเข้าถึง | รายละเอียด |
|---|---|---|
| **เว็บไซต์สำหรับผู้เข้าชม (Public Web)** | [http://localhost/](http://localhost/) | เว็บไซต์หลักแบบ Responsive และ Multi-language |
| **ระบบจัดการเนื้อหา (Admin Panel)** | [http://localhost/admin](http://localhost/admin) | แผงควบคุมระบบ CMS และการตั้งค่าเว็บไซต์ |
| **REST API Server** | [http://localhost:8080/api/v1](http://localhost:8080/api/v1) | Backend Go HTTP API Endpoints |
| **MinIO Object Storage Console** | [http://localhost:9001](http://localhost:9001) | แผงจัดการพื้นที่จัดเก็บไฟล์และคลังรูปภาพ |

---

## 🛠 คำสั่งสำหรับการพัฒนาบนเครื่องจำลอง (Local Development)

### ฝั่ง Backend (Go)
```bash
# ดาวน์โหลดและตรวจสอบ Dependencies
go mod download

# รันชุดแบบทดสอบอัตโนมัติ (Automated Tests)
go test -v ./...

# รัน Backend Server
go run cmd/server/main.go
```

### ฝั่ง Frontend (React / Vite)
```bash
cd frontend

# ติดตั้ง Dependencies
npm install

# รัน Development Server
npm run dev

# บิลด์สำหรับ Production
npm run build
```

---

## 📚 เอกสารคู่มือทางเทคนิคและสถาปัตยกรรม (Documentation Suite)

- 🏗 [สถาปัตยกรรมและการออกแบบระบบ (Architecture & System Design)](docs/ARCHITECTURE.md)
- 🗄 [โครงสร้างฐานข้อมูลและ ERD (Database Schema & ERD)](docs/DATABASE.md)
- 🔌 [ข้อมูลจำเพาะ REST API (REST API Specification)](docs/API.md)
- 📄 [เอกสาร OpenAPI 3.0 (OpenAPI Specification)](docs/openapi.yaml)
- 🛡 [มาตรการความปลอดภัยของระบบ (Security Model & Hardening)](docs/SECURITY.md)
- 🚀 [คู่มือการ Deploy บนระบบจริง (Production Deployment Guide)](docs/DEPLOYMENT.md)
- 💾 [แผนการสำรองและกู้คืนข้อมูล (Backup & Disaster Recovery)](docs/BACKUP.md)
- 📖 [คู่มือการใช้งานระบบจัดการเว็บไซต์ฉบับเต็ม (Service Manual TH)](docs/SERVICE_MANUAL_TH.md)

---

&copy; 2026 **บริษัท ไคโอทรอน เทคโนโลยี จำกัด (CHIOTRON TECHNOLOGY CO., LTD.)** สงวนลิขสิทธิ์ทุกประการ
