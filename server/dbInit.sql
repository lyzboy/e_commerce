CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    barcode varchar(20) UNIQUE,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(254),
    price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    description VARCHAR(150)
);

CREATE TABLE products_categories {
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, category_id)
};

