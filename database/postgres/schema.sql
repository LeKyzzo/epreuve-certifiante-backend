-- ============================================
--   Script de création de la base StockLink
-- ============================================

--  Création de la base de données
-- CREATE DATABASE stocklink;

-- ============================================
-- TABLE 1 : USERS (comptes applicatifs)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'utilisateur' CHECK (role IN ('utilisateur', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE 2 : WAREHOUSES (entrepôts physiques)
-- ============================================

CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL
);

-- ============================================
-- TABLE 3 : PRODUCTS (articles stockés)
-- ============================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    reference VARCHAR(50) UNIQUE NOT NULL,
    quantity INT DEFAULT 0,
    warehouse_id INT NOT NULL,
    CONSTRAINT fk_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id)
        ON DELETE CASCADE
);

-- ============================================
-- TABLE 4 : MOVEMENTS (historique des stocks)
-- ============================================

CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    type VARCHAR(10) NOT NULL CHECK (type IN ('IN', 'OUT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);
