# KhongKhun

แอปตามหาของหายด้วย React, Firebase Authentication และ Supabase

## การตั้งค่า Supabase

1. สร้างโปรเจกต์ Supabase แล้วคัดลอก Project URL กับ anon key ไปเพิ่มใน `.env`
   ตามชื่อตัวแปรใน `.env.example`
2. เปิด SQL Editor บน Supabase และรันเนื้อหาใน `supabase-schema.sql` หนึ่งครั้ง
   เพื่อสร้าง table `users` และ Storage bucket `post-images`

เมื่อผู้ใช้ส่งโพสต์ ระบบจะอัปโหลดรูปไปยัง Supabase Storage และบันทึก `uid`,
`email`, รูปโปรไฟล์ Google, ประเภทประกาศ (`lost` หรือ `search`), URL รูป
(`image_url`) และข้อความ `description` ลง table `users`

หน้า List จะดึงข้อมูลจาก `users` และแสดงคอมเมนต์จาก table `comments` ซึ่งถูกสร้าง
จาก `supabase-schema.sql` เช่นกัน

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
