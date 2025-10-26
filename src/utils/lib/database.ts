import mysql from "mysql2/promise";

// Konfigurasi database MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "e-commerce",
  port: parseInt(process.env.DB_PORT || "3306"),
};

// Pool connection untuk performa yang lebih baik
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;