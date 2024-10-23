-- Create the ecommerce database
CREATE DATABASE ecommerce;

-- Connect to the ecommerce database
\c ecommerce;

-- Tables

-- Products table (base products without quantity and price)
CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "barcode" varchar(20),
  "name" varchar(100),
  "description" varchar(254)
  "stock_quantity" integer
  "price" numeric(10,2)
);

-- Categories table (for product categories like "Shirts", "Electronics")
CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(25),
  "description" varchar(150)
);

-- Table for dynamic attributes like size, color, material, etc.
CREATE TABLE "attributes" (
  "id" SERIAL PRIMARY KEY,
  "attribute_name" varchar(100) NOT NULL
);

-- Table for attribute values (e.g., 'Red', 'Large', etc.)
CREATE TABLE "attribute_values" (
  "id" SERIAL PRIMARY KEY,
  "attribute_id" integer REFERENCES attributes(id) ON DELETE CASCADE,
  "value" varchar(100) NOT NULL
);

-- Table for product-attribute-value combinations (product variants)
CREATE TABLE "product_variants" (
  "id" SERIAL PRIMARY KEY,
  "product_id" integer REFERENCES products(id) ON DELETE CASCADE,
  "price" decimal(10,2) NOT NULL,  -- Price specific to the variant
  "stock_quantity" integer NOT NULL  -- Stock specific to the variant
);

-- Table linking product variants to attribute values (like size and color)
CREATE TABLE "variant_attribute_values" (
  "id" SERIAL PRIMARY KEY,
  "product_variant_id" integer REFERENCES product_variants(id) ON DELETE CASCADE,
  "attribute_value_id" integer REFERENCES attribute_values(id) ON DELETE CASCADE
);

-- Accounts table for user management
CREATE TABLE "accounts" (
  "email" varchar PRIMARY KEY,
  "username" varchar(50) NOT NULL,
  "name" varchar(254) NOT NULL,
  "password" varchar(64) NOT NULL,
  "phone_id" integer,
  "address_id" integer NOT NULL,
  "google_id" varchar
);

-- Admins table for admin management
CREATE TABLE "admins" (
  "id" SERIAL PRIMARY KEY,
  "account_email" varchar NOT NULL
);

-- Reset password codes table for password recovery
CREATE TABLE "reset_password_codes" (
  "id" SERIAL PRIMARY KEY,
  "reset_code" integer,
  "expire_time" date,
  "email" varchar
);

-- Address, Cities, and States tables for user locations
CREATE TABLE "addresses" (
  "id" SERIAL PRIMARY KEY,
  "street_name" varchar(75),
  "street_number" varchar(25),
  "city_id" integer
);

CREATE TABLE "cities" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(150),
  "state_id" integer
);

CREATE TABLE "states" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(150)
);

-- Orders and Order Products for user purchases
CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "status" varchar(25),
  "discount_id" integer,
  "date" date
);

CREATE TABLE "orders_products" (
  "product_id" integer,
  "order_id" integer,
  "quantity" integer,
  "price_at_order" decimal(10,2)
);

-- Discounts table for promo codes and deals
CREATE TABLE "discounts" (
  "id" SERIAL PRIMARY KEY,
  "code" varchar(16),
  "percent_off" decimal,
  "expire_date" date,
  "quantity" integer
);

-- Account Orders table (relationship between users and orders)
CREATE TABLE "accounts_orders" (
  "account_email" varchar,
  "order_id" integer
);

-- Carts and Cart Products for managing the user's shopping cart
CREATE TABLE "carts" (
  "id" SERIAL PRIMARY KEY,
  "account_email" varchar
);

CREATE TABLE "carts_products" (
  "product_id" integer,
  "cart_id" integer,
  "quantity" integer
);

-- Phones table for user contact information
CREATE TABLE "phones" (
  "id" SERIAL PRIMARY KEY,
  "number" varchar(10)
);

-- Products Categories table (relationship between products and categories)
CREATE TABLE "products_categories" (
  "product_id" integer,
  "category_id" integer
);

-- Payment token table for payment processing
CREATE TABLE "payment_token" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar,
  "token" varchar
);

-- Heros table for product banners or promotions
CREATE TABLE "heros" (
  "id" SERIAL PRIMARY KEY,
  "category_id" integer,
  "product_id" integer,
  "layout" integer,
  "heading" varchar,
  "sub_title_1" varchar,
  "sub_title_2" varchar,
  "background_color" varchar,
  "text_color" varchar
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_orders_products ON "orders_products" ("product_id", "order_id");
CREATE INDEX IF NOT EXISTS idx_accounts_orders ON "accounts_orders" ("account_email", "order_id");
CREATE INDEX IF NOT EXISTS idx_carts_products ON "carts_products" ("product_id", "cart_id");
CREATE INDEX IF NOT EXISTS idx_products_categories ON "products_categories" ("product_id", "category_id");

-- Foreign keys
ALTER TABLE "cities" ADD FOREIGN KEY ("state_id") REFERENCES "states" ("id");
ALTER TABLE "addresses" ADD FOREIGN KEY ("city_id") REFERENCES "cities" ("id");
ALTER TABLE "accounts" ADD FOREIGN KEY ("address_id") REFERENCES "addresses" ("id");
ALTER TABLE "accounts_orders" ADD FOREIGN KEY ("account_email") REFERENCES "accounts" ("email");
ALTER TABLE "accounts_orders" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");
ALTER TABLE "carts" ADD FOREIGN KEY ("account_email") REFERENCES "accounts" ("email");
ALTER TABLE "orders" ADD FOREIGN KEY ("discount_id") REFERENCES "discounts" ("id");
ALTER TABLE "orders_products" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");
ALTER TABLE "orders_products" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
ALTER TABLE "accounts" ADD FOREIGN KEY ("phone_id") REFERENCES "phones" ("id");
ALTER TABLE "carts_products" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
ALTER TABLE "carts_products" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id");
ALTER TABLE "products_categories" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");
ALTER TABLE "products_categories" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
ALTER TABLE "admins" ADD FOREIGN KEY ("account_email") REFERENCES "accounts" ("email");
ALTER TABLE "reset_password_codes" ADD FOREIGN KEY ("email") REFERENCES "accounts" ("email");
ALTER TABLE "payment_token" ADD FOREIGN KEY ("email") REFERENCES "accounts" ("email");
ALTER TABLE "heros" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
ALTER TABLE "heros" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

-- ROLES AND PRIVILEGES

-- Create a standard user role
CREATE ROLE standard_user;

-- Allow standard_user to connect to the database and perform SELECT on necessary tables
GRANT CONNECT ON DATABASE ecommerce TO standard_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO standard_user;

-- If standard users need to insert or modify data, grant the relevant privileges
GRANT INSERT, UPDATE ON TABLE accounts, carts, orders_products, carts_products TO standard_user;

-- Create an admin role
CREATE ROLE admin_user;

-- Grant all privileges to the admin_user role for database management
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO admin_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_user;

-- Create users and assign roles

-- Create a standard user
CREATE USER user1;
GRANT standard_user TO user1;

-- Create an admin user
CREATE USER admin1;
GRANT admin_user TO admin1;

-- Grant sequence usage and select privileges to admin user
DO $$
DECLARE r RECORD;
BEGIN
   FOR r IN SELECT sequence_schema, sequence_name
            FROM information_schema.sequences
            WHERE sequence_schema = 'public'
   LOOP
      EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE ' || r.sequence_schema || '.' || r.sequence_name || ' TO admin_user';
   END LOOP;
END $$;

-- Be sure to set passwords after creation
-- ALTER USER user1 WITH PASSWORD 'your_strong_password';
-- ALTER USER admin1 WITH PASSWORD 'your_strong_admin_password';

-- DATA INSERTION

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Shirts', 'Shirts descriptions'),
('Pants', 'Pants descriptions'),
('Dresses', 'Dresses descriptions'),
('Cooking', 'Cooking descriptions'),
('Camping', 'Camping descriptions'),
('Cars', 'Cars descriptions'),
('Games', 'Games descriptions'),
('Board Games', 'Board Games descriptions');

-- Insert product attributes (Size, Color)
INSERT INTO attributes (attribute_name) VALUES ('Size'), ('Color');

-- Insert attribute values (S, M, L for Size; Red, Blue for Color)
INSERT INTO attribute_values (attribute_id, value) 
VALUES 
  ((SELECT id FROM attributes WHERE attribute_name = 'Size'), 'S'),
  ((SELECT id FROM attributes WHERE attribute_name = 'Size'), 'M'),
  ((SELECT id FROM attributes WHERE attribute_name = 'Size'), 'L'),
  ((SELECT id FROM attributes WHERE attribute_name = 'Color'), 'Red'),
  ((SELECT id FROM attributes WHERE attribute_name = 'Color'), 'Blue');

-- Insert products (Cotton T-shirt)
INSERT INTO products (barcode, name, description)
VALUES ('12345', 'Cotton T-Shirt', 'A basic cotton t-shirt');

-- Insert product variants for Cotton T-Shirt
INSERT INTO product_variants (product_id, price, stock_quantity)
VALUES 
(5, 19.99, 100),  -- Small Red T-shirt
(5, 19.99, 100),  -- Small Blue T-shirt
(5, 21.99, 80),   -- Medium Red T-shirt
(5, 21.99, 80),   -- Medium Blue T-shirt
(5, 23.99, 60),   -- Large Red T-shirt
(5, 23.99, 60);   -- Large Blue T-shirt

-- Link product variants to their attribute values
INSERT INTO variant_attribute_values (product_variant_id, attribute_value_id)
VALUES 
(1, (SELECT id FROM attribute_values WHERE value = 'S')), -- Small
(1, (SELECT id FROM attribute_values WHERE value = 'Red')), -- Red
(2, (SELECT id FROM attribute_values WHERE value = 'S')), -- Small
(2, (SELECT id FROM attribute_values WHERE value = 'Blue')), -- Blue
(3, (SELECT id FROM attribute_values WHERE value = 'M')), -- Medium
(3, (SELECT id FROM attribute_values WHERE value = 'Red')), -- Red
(4, (SELECT id FROM attribute_values WHERE value = 'M')), -- Medium
(4, (SELECT id FROM attribute_values WHERE value = 'Blue')), -- Blue
(5, (SELECT id FROM attribute_values WHERE value = 'L')), -- Large
(5, (SELECT id FROM attribute_values WHERE value = 'Red')), -- Red
(6, (SELECT id FROM attribute_values WHERE value = 'L')), -- Large
(6, (SELECT id FROM attribute_values WHERE value = 'Blue')); -- Blue

-- QUERY to retrieve product variants with combined attributes
SELECT 
    p.name AS product_name,
    pv.price,
    pv.stock_quantity,
    STRING_AGG(av.value, ' ') AS variant_attributes
FROM 
    products p
JOIN 
    product_variants pv ON p.id = pv.product_id
JOIN 
    variant_attribute_values vav ON pv.id = vav.product_variant_id
JOIN 
    attribute_values av ON vav.attribute_value_id = av.id
WHERE 
    p.id = 5  -- Product ID for Cotton T-Shirt
GROUP BY 
    pv.id, p.name, pv.price, pv.stock_quantity;
