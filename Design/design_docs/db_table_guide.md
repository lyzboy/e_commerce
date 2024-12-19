[ &#127968; Return To Design Info](../design_info.md)

# Database Table Guide

This guide will provide a detailed explanation of the database tables and their relationships. The database schema is designed to be normalized and efficient. The tables are designed to be as small as possible to reduce the amount of data that needs to be queried.

## Table of Contents


[**Discounts**](#discounts)<br>

## Discounts

The discounts table stores information about discounts that can be applied to orders. Discounts can be applied to specific products or product variants. Discounts can be applied as a percentage or a fixed amount.

### `discounts` Table

This table will hold the discounts that can be applied to orders. It contains the following columns:

- `id`: *required* - The unique identifier for the discount.
- `code`: *optional* - An optional code that the user can enter to apply the discount. If `NULL`, the discount will be automatically applied.
- `percent_off`: *required* - The percentage off the retail price that the discount provides. If an amount off is provided, this field will not be used.
- `amount_off`: *optional* - The fixed amount that the discount provides. If this field is not `NULL`, the `percent_off` field will not be used.
- `expire_date`: *optional* - The date that the discount expires. If `NULL` the discount will never expire.
- `quantity`: *optional* - The number of times the discount can be used. If `NULL`, the discount can be used an unlimited number of times.

### `products_discounts` Table

This table will hold the relationships between products and discounts. This table will be used to establish which products have a discount. To add/remove a discount to a product, table must be used. It contains the following columns:

- `id`: *required* - The unique identifier for the products_discounts.
- `product_id`: *required* | *FK* - The foreign key to the product that the discount applies to from the `products` table.
- `discount_id`: *required* | *FK* - The foreign key to the discount that applies to the product from the `discounts` table.
- `product_variant_id`: *optional* | *FK* - The foreign key to the product variant that the discount applies to from the `product_variants` table. If this field is not `NULL`, the discount will only apply to the specific product variant. If this field is `NULL`, the discount will apply to all variants of the product. 