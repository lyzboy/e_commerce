-- Create the ecommerce database
CREATE DATABASE ecommerce;

-- Connect to the ecommerce database
\c ecommerce;

-- Tables

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "barcode" varchar(20),
  "name" varchar(100),
  "description" varchar(254),
  "price" decimal(10,2),
  "quantity" integer
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(25),
  "description" varchar(150)
);

CREATE TABLE "accounts" (
  "email" varchar PRIMARY KEY,
  "username" varchar(50) NOT NULL,
  "name" varchar(254) NOT NULL,
  "password" varchar(64) NOT NULL,
  "phone_id" integer,
  "address_id" integer NOT NULL,
  "google_id" varchar
);

CREATE TABLE "admins" (
  "id" SERIAL PRIMARY KEY,
  "account_email" varchar NOT NULL
);

CREATE TABLE "reset_password_codes" (
  "id" SERIAL PRIMARY KEY,
  "reset_code" integer,
  "expire_time" date,
  "email" varchar
);

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

CREATE TABLE "discounts" (
  "id" SERIAL PRIMARY KEY,
  "code" varchar(16),
  "percent_off" decimal,
  "expire_date" date,
  "quantity" integer
);

CREATE TABLE "accounts_orders" (
  "account_email" varchar,
  "order_id" integer
);

CREATE TABLE "carts" (
  "id" SERIAL PRIMARY KEY,
  "account_email" varchar
);

CREATE TABLE "carts_products" (
  "product_id" integer,
  "cart_id" integer,
  "quantity" integer
);

CREATE TABLE "phones" (
  "id" SERIAL PRIMARY KEY,
  "number" varchar(10)
);

CREATE TABLE "products_categories" (
  "product_id" integer,
  "category_id" integer
);

CREATE TABLE "payment_token" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar,
  "token" varchar
);

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
CREATE INDEX IF NOT EXISTS ON "orders_products" ("product_id", "order_id");
CREATE INDEX IF NOT EXISTS ON "accounts_orders" ("account_email", "order_id");
CREATE INDEX IF NOT EXISTS ON "carts_products" ("product_id", "cart_id");
CREATE INDEX IF NOT EXISTS ON "products_categories" ("product_id", "category_id");

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

-- Be sure to set passwords after creation
-- ALTER USER user1 WITH PASSWORD 'your_strong_password';
-- ALTER USER admin1 WITH PASSWORD 'your_strong_admin_password';
