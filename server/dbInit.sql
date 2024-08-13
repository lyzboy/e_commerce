CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    barcode varchar(20) UNIQUE,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(254),
    price NUMERIC(10,2) NOT NULL CHECK(price > 0.00),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK(quantity > 0)
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) UNIQUE,
    description VARCHAR(150)
);

CREATE TABLE products_categories (
    product_id INTEGER NOT NULL REFERENCES products(id),
    category_id INTEGER NOT NULL REFERENCES categories(id),
    PRIMARY KEY (product_id, category_id)
);

CREATE TABLE states(
    id SERIAL PRIMARY KEY,
    name varchar(150) NOT NULL
);

CREATE TABLE cities(
    id SERIAL PRIMARY KEY,
    name varchar(150) UNIQUE NOT NULL,
    state_id integer NOT NULL REFERENCES states(id)
);

CREATE TABLE addresses(
    id SERIAL PRIMARY KEY,
    street_name varchar(75) NOT NULL,
    street_number varchar(25) NOT NULL,
    city_id integer NOT NULL REFERENCES cities(id)
);

CREATE TABLE phones(
    id SERIAL PRIMARY KEY,
    phone_number varchar(10) NOT NULL UNIQUE CHECK(phone_number ~ '^\d{10}$')
);

CREATE TABLE accounts (
    email VARCHAR(254) PRIMARY KEY CHECK (email ~ '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
    username VARCHAR(50) UNIQUE NOT NULL CHECK(LENGTH(username) > 2),
    name VARCHAR(254) NOT NULL,
    password VARCHAR(254) NOT NULL,
    phone_id integer NOT NULL REFERENCES phones(id),
    address_id integer NOT NULL REFERENCES addresses(id)
);

CREATE TABLE carts(
    id SERIAL PRIMARY KEY,
    account_email varchar(254) NOT NULL UNIQUE REFERENCES accounts(email)
);

CREATE TABLE carts_products(
    product_id INTEGER REFERENCES products(id),
    cart_id INTEGER REFERENCES carts(id),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    PRIMARY KEY (product_id, cart_id)
);

CREATE TABLE discounts(
    id SERIAL PRIMARY KEY,
    code varchar(16) UNIQUE,
    percent_off NUMERIC(3,2) 
    CHECK (percent_off >= 0.00 AND percent_off <= 1.00),
    expire_date date NOT NULL CHECK(expire_date > NOW()),
    quantity INTEGER DEFAULT 0
);

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    status varchar(25) NOT NULL CHECK(status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')),
    discount_id INTEGER DEFAULT NULL REFERENCES discounts(id),
    placed_on date
);

CREATE TABLE orders_products(
    product_id INTEGER NOT NULL REFERENCES products(id),
    order_id INTEGER NOT NULL REFERENCES orders(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_order DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(product_id, order_id)
);

CREATE TABLE accounts_orders(
    account_email VARCHAR(254) NOT NULL REFERENCES accounts(email),
    order_id INTEGER NOT NULL REFERENCES orders(id),
    PRIMARY KEY (account_email, order_id)
);