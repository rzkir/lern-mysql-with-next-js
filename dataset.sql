-- Gunakan database yang sudah ada (InfinityFree)
USE if0_40194964_ecommerce;

-- Buat tabel users untuk contoh CRUD
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert beberapa data contoh
INSERT INTO users (name, email, phone) VALUES 
('John Doe', 'john@example.com', '081234567890'),
('Jane Smith', 'jane@example.com', '081234567891'),
('Bob Johnson', 'bob@example.com', '081234567892');
