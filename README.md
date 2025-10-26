# Aplikasi CRUD dengan Next.js dan MySQL

Aplikasi CRUD (Create, Read, Update, Delete) sederhana yang dibangun menggunakan Next.js 15, TypeScript, Tailwind CSS, dan MySQL.

## Fitur

- ✅ **Create**: Tambah user baru
- ✅ **Read**: Lihat daftar semua users
- ✅ **Update**: Edit data user yang sudah ada
- ✅ **Delete**: Hapus user dengan konfirmasi
- ✅ **Responsive Design**: UI yang responsif menggunakan Tailwind CSS
- ✅ **TypeScript**: Type safety untuk development yang lebih baik
- ✅ **Error Handling**: Penanganan error yang baik

## Teknologi yang Digunakan

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Database Driver**: mysql2

## Setup dan Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd lern-curd
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database MySQL

#### Opsi 1: Menggunakan MySQL Server Lokal

1. Install MySQL Server di komputer Anda
2. Buat database baru:

```sql
CREATE DATABASE crud_app;
```

#### Opsi 2: Menggunakan XAMPP/WAMP

1. Install XAMPP atau WAMP
2. Start Apache dan MySQL services
3. Buka phpMyAdmin dan buat database `crud_app`

### 4. Import Database Schema

Jalankan file `dataset.sql` di MySQL:

```bash
mysql -u root -p < dataset.sql
```

Atau copy-paste isi file `dataset.sql` ke MySQL client/phpMyAdmin.

### 5. Konfigurasi Environment Variables

#### Untuk Database Lokal:

Buat file `.env.local` di root project:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=crud_app
DB_PORT=3306
```

#### Untuk Database InfinityFree:

Buat file `.env.local` di root project:

```env
DB_HOST=sql211.infinityfree.com
DB_USER=if0_40194964
DB_PASSWORD=your_vpanel_password
DB_NAME=if0_40194964_ecommerce
DB_PORT=3306
```

**Catatan:**

- Konfigurasi database sudah terpusat di file `src/utils/lib/database.ts`
- Menggunakan connection pooling untuk performa yang lebih baik
- Untuk InfinityFree, gunakan password vPanel Anda sebagai DB_PASSWORD

### 6. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Struktur Project

```
src/
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── route.ts          # GET, POST /api/users
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE /api/users/[id]
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Halaman utama
├── components/
│   ├── UserForm.tsx              # Form untuk create/edit user
│   └── UserTable.tsx             # Tabel untuk menampilkan users
src/
└── utils/
    └── lib/
        └── database.ts           # Konfigurasi database terpusat
```

## API Endpoints

### Users

- `GET /api/users` - Ambil semua users
- `POST /api/users` - Buat user baru
- `GET /api/users/[id]` - Ambil user berdasarkan ID
- `PUT /api/users/[id]` - Update user berdasarkan ID
- `DELETE /api/users/[id]` - Hapus user berdasarkan ID

### Request/Response Format

#### POST /api/users

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890"
}
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "081234567890",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Database Schema

### Table: users

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Error: "Can't connect to MySQL server"

1. Pastikan MySQL server berjalan
2. Cek konfigurasi di `.env.local`
3. Pastikan username dan password benar

### Error: "Database doesn't exist"

1. Buat database `crud_app` di MySQL
2. Import schema dari `dataset.sql`

### Error: "Table doesn't exist"

1. Jalankan script SQL di `dataset.sql`
2. Pastikan database yang dipilih adalah `crud_app`

## Development

### Menambah Fitur Baru

1. Buat API route di `src/app/api/`
2. Buat komponen React di `src/components/`
3. Update halaman utama di `src/app/page.tsx`

### Styling

Aplikasi menggunakan Tailwind CSS. Untuk styling tambahan, edit file `src/app/globals.css` atau tambahkan class Tailwind langsung di komponen.

## License

MIT License
# lern-mysql-with-next-js
