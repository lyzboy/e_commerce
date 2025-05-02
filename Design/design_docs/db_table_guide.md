[ &#127968; Return To Design Info](../design_info.md)

# Database Table Guide

This guide provides a detailed explanation of the database tables found in `ecommerce_test.sql` and their relationships.

## Table of Contents

[**Accounts & Users**](#accounts--users)<br>
[**Addresses**](#addresses)<br>
[**Products & Inventory**](#products--inventory)<br>
[**Categories**](#categories)<br>
[**Attributes**](#attributes)<br>
[**Orders**](#orders)<br>
[**Carts**](#carts)<br>
[**Discounts**](#discounts)<br>
[**Site Configuration**](#site-configuration)<br>
[**Security & Tokens**](#security--tokens)<br>

## Accounts & Users

Tables related to user accounts and administration.

### `accounts` Table

Stores core user account information.

- `email`: *required* | *PK* - The user's email address (Primary Key).
- `username`: *required* - The user's chosen username.
- `name`: *optional* - The user's full name.
- `password`: *required* - The hashed password for the user.
- `phone_id`: *optional* | *FK* - Foreign key referencing the `phones` table.
- `address_id`: *optional* | *FK* - Foreign key referencing the `addresses` table (likely a default or primary address).
- `google_id`: *optional* - Stores Google ID for OAuth integration.

### `admins` Table

Identifies which accounts have administrative privileges.

- `id`: *required* | *PK* - The unique identifier for the admin entry (auto-incrementing).
- `account_email`: *required* | *FK* - Foreign key referencing the `accounts` table email.

### `phones` Table

Stores phone numbers associated with accounts.

- `id`: *required* | *PK* - The unique identifier for the phone number (auto-incrementing).
- `number`: *optional* - The phone number string.

## Addresses

Tables for managing geographical locations and user addresses.

### `addresses` Table

Stores street address information.

- `id`: *required* | *PK* - The unique identifier for the address (auto-incrementing).
- `street_name`: *optional* - The street name and number.
- `city_id`: *optional* | *FK* - Foreign key referencing the `cities` table.

### `cities` Table

Stores city names.

- `id`: *required* | *PK* - The unique identifier for the city (auto-incrementing).
- `name`: *optional* - The name of the city.
- `state_id`: *optional* | *FK* - Foreign key referencing the `states` table.

### `states` Table

Stores state names and abbreviations.

- `id`: *required* | *PK* - The unique identifier for the state (auto-incrementing).
- `name`: *optional* - The full name of the state.
- `abbreviation`: *optional* | *unique* - The two-letter abbreviation for the state.

## Products & Inventory

Tables related to the products sold.

### `products` Table

Stores base product information. Note: Price and stock might be primarily managed at the variant level if variants exist.

- `id`: *required* | *PK* - The unique identifier for the product (auto-incrementing).
- `barcode`: *optional* - The product's barcode.
- `name`: *optional* - The name of the product.
- `description`: *optional* - A description of the product.
- `price`: *optional* - Base price (may be overridden by variants).
- `stock_quantity`: *optional* - Base stock (may be overridden by variants).

### `product_variants` Table

Stores variations of a product (e.g., size, color).

- `id`: *required* | *PK* - The unique identifier for the product variant (auto-incrementing).
- `product_id`: *optional* | *FK* - Foreign key referencing the `products` table.
- `price`: *required* - The price specific to this variant.
- `stock_quantity`: *required* - The stock quantity specific to this variant.

## Categories

Tables for organizing products.

### `categories` Table

Stores product categories.

- `id`: *required* | *PK* - The unique identifier for the category (auto-incrementing).
- `name`: *optional* - The name of the category.
- `description`: *optional* - A description of the category.

### `products_categories` Table

Links products to categories (Many-to-Many relationship).

- `product_id`: *optional* | *FK* - Foreign key referencing the `products` table.
- `category_id`: *optional* | *FK* - Foreign key referencing the `categories` table.
- **Index**: (`product_id`, `category_id`)

## Attributes

Tables for defining product attributes (like size, color).

### `attributes` Table

Defines the types of attributes available.

- `id`: *required* | *PK* - The unique identifier for the attribute type (auto-incrementing).
- `attribute_name`: *required* - The name of the attribute (e.g., "Size", "Color").

### `attribute_values` Table

Stores the possible values for each attribute type.

- `id`: *required* | *PK* - The unique identifier for the attribute value (auto-incrementing).
- `attribute_id`: *optional* | *FK* - Foreign key referencing the `attributes` table.
- `value`: *required* - The specific value (e.g., "Large", "Blue").

### `variant_attribute_values` Table

Links specific product variants to their attribute values (Many-to-Many relationship).

- `id`: *required* | *PK* - The unique identifier for this link (auto-incrementing).
- `product_variant_id`: *optional* | *FK* - Foreign key referencing the `product_variants` table.
- `attribute_value_id`: *optional* | *FK* - Foreign key referencing the `attribute_values` table.

## Orders

Tables related to customer orders.

### `orders` Table

Stores header information for customer orders.

- `id`: *required* | *PK* - The unique identifier for the order (auto-incrementing).
- `status`: *optional* - The current status of the order (e.g., 'pending', 'shipped').
- `discount_id`: *optional* | *FK* - Foreign key referencing the `discounts` table if a discount was applied to the whole order.
- `date`: *optional* - The date the order was placed.

### `orders_products` Table

Stores the individual items (products/variants) within an order (Many-to-Many relationship).

- `product_id`: *optional* | *FK* - Foreign key referencing the `products` table (consider if this should be `product_variant_id` instead).
- `order_id`: *optional* | *FK* - Foreign key referencing the `orders` table.
- `quantity`: *optional* - The quantity of the product ordered.
- `price_at_order`: *optional* - The price of the product at the time the order was placed.
- **Index**: (`product_id`, `order_id`)

### `accounts_orders` Table

Links orders to the accounts that placed them (Many-to-Many relationship, supports multiple orders per account).

- `account_email`: *optional* | *FK* - Foreign key referencing the `accounts` table email.
- `order_id`: *optional* | *FK* - Foreign key referencing the `orders` table.
- **Index**: (`account_email`, `order_id`)

## Carts

Tables related to shopping carts.

### `carts` Table

Stores shopping cart information, linked to user accounts.

- `id`: *required* | *PK* - The unique identifier for the cart (auto-incrementing).
- `account_email`: *optional* | *FK* | *unique* - Foreign key referencing the `accounts` table email. Each account has one cart.

### `carts_products` Table

Stores the products currently in a shopping cart (Many-to-Many relationship).

- `product_id`: *optional* | *FK* - Foreign key referencing the `products` table (consider if this should be `product_variant_id`).
- `cart_id`: *optional* | *FK* - Foreign key referencing the `carts` table.
- `quantity`: *optional* - The quantity of the product in the cart.
- **Index**: (`product_id`, `cart_id`)

## Discounts

Tables for managing discounts and promotions.

### `discounts` Table

Stores information about available discounts.

- `id`: *required* | *PK* - The unique identifier for the discount (auto-incrementing).
- `code`: *optional* - The code users enter to apply the discount.
- `percent_off`: *required* - The percentage discount. Note: The schema requires this, but logic might prioritize `amount_off` if present.
- `expire_date`: *optional* - The date the discount expires.
- `quantity`: *optional* - The number of times the discount can be used in total.
- `amount_off`: *optional* - A fixed amount discount.

### `products_discounts` Table

Links discounts to specific products or variants.

- `id`: *required* | *PK* - The unique identifier for this discount application rule (auto-incrementing).
- `product_id`: *required* | *FK* - Foreign key referencing the `products` table.
- `discount_id`: *required* | *FK* - Foreign key referencing the `discounts` table.
- `product_variant_id`: *optional* | *FK* - Foreign key referencing the `product_variants` table. If set, the discount applies only to this variant.

## Site Configuration

Tables related to website presentation and layout.

### `heros` Table

Stores configuration for hero sections/banners on the site.

- `id`: *required* | *PK* - The unique identifier for the hero configuration (auto-incrementing).
- `category_id`: *optional* | *FK* - Foreign key referencing `categories` (if the hero links to a category).
- `product_id`: *optional* | *FK* - Foreign key referencing `products` (if the hero links to a product).
- `layout`: *optional* - An identifier for the layout type.
- `heading`: *optional* - Main text/heading for the hero.
- `sub_title_1`: *optional* - First line of subtitle text.
- `sub_title_2`: *optional* - Second line of subtitle text.
- `background_color`: *optional* - Background color code.
- `text_color`: *optional* - Text color code.

## Security & Tokens

Tables related to security features like password resets and payment tokens.

### `reset_password_codes` Table

Stores temporary codes for password reset requests.

- `id`: *required* | *PK* - The unique identifier for the reset code entry (auto-incrementing).
- `reset_code`: *optional* - The temporary code sent to the user.
- `expire_time`: *optional* - Timestamp indicating when the code expires.
- `email`: *optional* | *FK* - Foreign key referencing the `accounts` table email associated with the reset request.

### `payment_token` Table

Potentially stores tokens related to payment processing (Purpose might need clarification based on implementation).

- `id`: *required* | *PK* - The unique identifier for the token (auto-incrementing).
- `email`: *optional* | *FK* - Foreign key referencing the `accounts` table email.
- `token`: *optional* - The payment-related token string.