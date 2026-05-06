<table align="center">
  <tr>
    <td align="center" valign="middle">
      <img
        width="55"
        src="https://github.com/user-attachments/assets/1bb1aa9c-bb04-4fc1-8cbf-d8e9384b83b4"
        alt="Next.js Logo"
      />
    </td>
    <td valign="middle">
      <h1>
        PT. Reliable Future Technology - Website Company Profile
      </h1>
    </td>
  </tr>
</table>

Website company profile modern berbasis Next.js dengan performa tinggi, keamanan optimal, dan tampilan premium dark mode untuk kebutuhan corporate dan teknologi. 

## Teknologi yang Digunakan

* Framework: Next.js 16 (App Router)
* Bahasa: TypeScript
* Styling: Tailwind CSS v4 + shadcn/ui
* State Management: Zustand
* Validasi: Zod
* Animasi: Framer Motion
* Cache: DragonflyDB (Redis-compatible)
* Database: PostgreSQL 15
* Authentication: Keycloak (OIDC)
* Object Storage: MinIO (S3-compatible)
* Containerization: Docker


## Persiapan Awal

Pastikan sudah terinstall:

* Node.js versi 20+
* npm atau yarn
* Docker & Docker Compose
* PostgreSQL
* DragonflyDB / Redis-compatible server


# Instalasi Project

## 1. Clone Repository

```bash
git clone https://github.com/ferdy-s/Company-Profile-RFT.git
cd Company-Profile-RFT
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Setup Environment

Buat file `.env` pada root project:

```env
NODE_ENV=development

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rft_blog

AUTH_SECRET=your-secret-key-minimum-32-character

KEYCLOAK_CLIENT_ID=rft-web
KEYCLOAK_CLIENT_SECRET=your-keycloak-secret
KEYCLOAK_ISSUER=http://localhost:8080/realms/rft

REDIS_URL=redis://:password@localhost:6379
REDIS_PASSWORD=your-redis-password

S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=blog-images
S3_REGION=us-east-1

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Menjalankan Development Server

```bash
npm run dev
```

Buka browser:

```txt
http://localhost:3000
```

---

# Build Production

```bash
npm run build
npm run start
```

---

# Deployment Docker

## Menjalankan Docker Compose

```bash
docker-compose up -d
```

Stop container:

```bash
docker-compose down
```

---

# Struktur Project

```txt
app/
components/
lib/
store/
Dockerfile
docker-compose.yml
next.config.ts
```

---

# Fitur Utama

* App Router Next.js terbaru
* Dark Mode Premium UI
* Responsive Design
* Security Headers
* Redis-Compatible Caching
* Authentication Keycloak
* Docker Ready
* SEO Friendly
* Optimized Performance

---

# Script Penting

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

# Catatan

* Menggunakan React Server Components
* Client Components menggunakan `"use client"`
* Zustand digunakan untuk state management frontend
* Framer Motion digunakan untuk animasi modern

---

# License

Copyright © PT. Reliable Future Technology. All rights reserved.
