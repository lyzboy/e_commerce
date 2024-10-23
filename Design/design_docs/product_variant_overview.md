# Product Variants Storage System: Explanation

This document explains the updated **variant storage** system, outlining the role of each table and how they work together to represent products with various attributes (like size, color, etc.) and their specific details like price and stock.

## Overview of the System

We are using a **key-value pair approach** to represent product variants (like size, color, etc.), which allows us to flexibly add new attributes as needed (e.g., different dimensions, material types, etc.). Here’s a breakdown of the tables involved and how they relate:

## 1. Products Table

**Purpose:** The `products` table stores the basic information about the product itself, without any specific variant details like size or color.

| Column       | Type      | Description                      |
|--------------|-----------|----------------------------------|
| id           | SERIAL    | Unique identifier for the product (Primary Key). |
| barcode      | varchar   | Product barcode.                 |
| name         | varchar   | The name of the product (e.g., "Cotton T-Shirt"). |
| description  | varchar   | A description of the product.    |

- Each row in this table represents a **single product** (without specific variations like size or color).
- Example: "Cotton T-Shirt" is stored as one entry, regardless of size or color.

## 2. Attributes Table

**Purpose:** The `attributes` table stores different types of attributes (like size, color, material, etc.) that describe the variants of a product.

| Column         | Type    | Description                        |
|----------------|---------|------------------------------------|
| id             | SERIAL  | Unique identifier for the attribute (Primary Key). |
| attribute_name | varchar | Name of the attribute (e.g., "Size", "Color").      |

- Each row represents a **type of attribute** that can apply to products.
- Example: "Size" and "Color" are stored as separate entries here.

## 3. Attribute Values Table

**Purpose:** The `attribute_values` table stores the possible values for each attribute. For example, for the "Size" attribute, the possible values might be "S", "M", and "L".

| Column         | Type    | Description                                       |
|----------------|---------|---------------------------------------------------|
| id             | SERIAL  | Unique identifier for the attribute value (Primary Key). |
| attribute_id   | integer | Foreign key to the `attributes` table, identifying the type of attribute this value belongs to (e.g., "Size" or "Color"). |
| value          | varchar | The actual value of the attribute (e.g., "S", "M", "L", "Red", "Blue"). |

- Each row here represents a **specific value** for a given attribute.
- Example: "S", "M", and "L" for "Size", and "Red", "Blue" for "Color".

## 4. Product Variants Table

**Purpose:** The `product_variants` table links a product to its specific variants (combinations of attributes like size and color). Each variant has its own price and stock quantity.

| Column           | Type       | Description                                      |
|------------------|------------|--------------------------------------------------|
| id               | SERIAL     | Unique identifier for the product variant (Primary Key). |
| product_id       | integer    | Foreign key to the `products` table, identifying the product (e.g., Cotton T-Shirt). |
| price            | decimal    | The price for this specific variant (e.g., price for "S", "Red" t-shirt). |
| stock_quantity   | integer    | The stock quantity available for this variant.   |

- Each row represents a **unique combination of attributes** for a product.

## 5. Variant Attribute Values Table

**Purpose:** The `variant_attribute_values` table links each variant to its specific attribute values (e.g., Size, Color). This allows a variant to have multiple attributes.

| Column               | Type       | Description                                      |
|----------------------|------------|--------------------------------------------------|
| id                   | SERIAL     | Unique identifier for the variant-attribute-value link (Primary Key). |
| product_variant_id    | integer    | Foreign key to the `product_variants` table, identifying the variant. |
| attribute_value_id    | integer    | Foreign key to the `attribute_values` table, identifying the specific value (e.g., "S", "Red"). |

- Each row links a **variant** to an **attribute value**, allowing products to have multiple variants.

## How These Tables Work Together

### Products
A basic product (like "Cotton T-Shirt") is stored in the `products` table.

### Attributes and Attribute Values
- The `attributes` table defines what types of variations a product can have (e.g., Size, Color).
- The `attribute_values` table defines the actual values for those attributes (e.g., "S", "M", "L" for Size and "Red", "Blue" for Color).

### Product Variants
The `product_variants` table stores each possible combination of attributes for a product, with its own price and stock quantity.

### Example Workflow: Storing a Cotton T-Shirt with Variants

1. **Insert the product into the `products` table**:

    ```sql
    INSERT INTO products (barcode, name, description)
    VALUES ('12345', 'Cotton T-Shirt', 'A basic cotton t-shirt');
    ```

2. **Insert the attributes into the `attributes` table** (if they don’t already exist):

    ```sql
    INSERT INTO attributes (attribute_name)
    VALUES ('Size'), ('Color');
    ```

3. **Insert the values into the `attribute_values` table**:

    ```sql
    INSERT INTO attribute_values (attribute_id, value)
    VALUES 
      ((SELECT id FROM attributes WHERE attribute_name = 'Size'), 'S'),
      ((SELECT id FROM attributes WHERE attribute_name = 'Size'), 'M'),
      ((SELECT id FROM attributes WHERE attribute_name = 'Size'), 'L'),
      ((SELECT id FROM attributes WHERE attribute_name = 'Color'), 'Red'),
      ((SELECT id FROM attributes WHERE attribute_name = 'Color'), 'Blue');
    ```

4. **Insert the product variants (combinations of size and color) into the `product_variants` table**:

    ```sql
    INSERT INTO product_variants (product_id, price, stock_quantity)
    VALUES 
      (5, 19.99, 100),
      (5, 21.99, 80),
      (5, 23.99, 60);
    ```

5. **Link product variants to their attribute values**:

    ```sql
    INSERT INTO variant_attribute_values (product_variant_id, attribute_value_id)
    VALUES 
      (1, (SELECT id FROM attribute_values WHERE value = 'S')),
      (1, (SELECT id FROM attribute_values WHERE value = 'Red')),
      (2, (SELECT id FROM attribute_values WHERE value = 'M')),
      (2, (SELECT id FROM attribute_values WHERE value = 'Blue')),
      (3, (SELECT id FROM attribute_values WHERE value = 'L')),
      (3, (SELECT id FROM attribute_values WHERE value = 'Red'));
    ```

6. **Query the product and its variants**:

    ```sql
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
        p.id = 5
    GROUP BY 
        pv.id, p.name, pv.price, pv.stock_quantity;
    ```

This query will return all the variants for the "Cotton T-Shirt," displaying their combined attributes (like "S Red") along with prices and stock quantities.

## Key Benefits of This System:

- **Flexibility**: You can add any number of new attributes (e.g., "Material", "Length") without altering the database schema.
- **Scalability**: Each product can have an unlimited number of variants, each with its own unique combination of attributes, price, and stock.
- **Separation of Concerns**: The product details are separated from the variant details, making it easier to manage both aspects independently.
