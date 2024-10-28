const { query } = require("../config/db");
const { createVariants, updateVariants } = require("./variants-model");

exports.getProducts = async ({ categoryId, minPrice, maxPrice }) => {
    try {
        let queryText = `
            SELECT 
                products.*,
                COALESCE(MIN(product_variants.price), products.price) AS effective_price
            FROM 
                products
            LEFT JOIN 
                product_variants ON products.id = product_variants.product_id
        `;
        const queryParams = [];
        const conditions = [];

        // Add JOINs and filter by category if categoryId is provided
        if (categoryId) {
            queryText += `
                JOIN products_categories 
                    ON products.id = products_categories.product_id
                JOIN categories 
                    ON categories.id = products_categories.category_id
            `;
            conditions.push(`categories.id = $${queryParams.length + 1}`);
            queryParams.push(categoryId);
        }

        // Add price conditions if specified
        if (minPrice) {
            conditions.push(
                `COALESCE(product_variants.price, products.price) >= $${
                    queryParams.length + 1
                }`
            );
            queryParams.push(minPrice);
        }
        if (maxPrice) {
            conditions.push(
                `COALESCE(product_variants.price, products.price) <= $${
                    queryParams.length + 1
                }`
            );
            queryParams.push(maxPrice);
        }

        // Combine all conditions with WHERE/AND logic
        if (conditions.length > 0) {
            queryText += ` WHERE ` + conditions.join(" AND ");
        }

        // Group by products.id to ensure one row per product
        queryText += ` GROUP BY products.id`;

        const results = await query(queryText, queryParams);
        return results.rows;
    } catch (error) {
        throw new Error(error);
    }
};

exports.createProduct = async (productObject) => {
    try {
        const { barcode, name, description, price, stock_quantity, variants } =
            productObject;

        // Prepare the query for product insertion
        let queryText = "INSERT INTO products ";
        let fieldsArray = [];
        let queryParams = [];
        let valuesArray = [];

        if (barcode) {
            fieldsArray.push("barcode");
            queryParams.push(barcode);
            valuesArray.push(`$${queryParams.length}`);
        }
        if (name) {
            fieldsArray.push("name");
            queryParams.push(name);
            valuesArray.push(`$${queryParams.length}`);
        }
        if (description) {
            fieldsArray.push("description");
            queryParams.push(description);
            valuesArray.push(`$${queryParams.length}`);
        }
        if (price) {
            fieldsArray.push("price");
            queryParams.push(price);
            valuesArray.push(`$${queryParams.length}`);
        }
        if (stock_quantity) {
            fieldsArray.push("stock_quantity");
            queryParams.push(stock_quantity);
            valuesArray.push(`$${queryParams.length}`);
        }

        queryText += `(${fieldsArray.join(", ")}) `;
        queryText += `VALUES (${valuesArray.join(", ")}) `;
        queryText += `RETURNING *`;

        // Execute product insertion
        const productResult = await query(queryText, queryParams, true);
        const newProduct = productResult.rows[0];

        // Handle variants if provided
        if (variants && variants.length > 0) {
            // Pass the new product ID and the variants array to the createVariants function
            await createVariants(newProduct.id, variants);
        }

        // Fetch the product along with its variants
        const fullProductData = await this.getProductWithVariants(
            newProduct.id
        );
        return fullProductData;
    } catch (error) {
        throw new Error(error);
    }
};
exports.getProduct = async (productId) => {
    try {
        let queryText = "Select * FROM products WHERE id = $1";
        let queryParams = [productId];
        const results = await query(queryText, queryParams, true);
        return results.rows[0];
    } catch (error) {
        throw new Error(error);
    }
};

exports.updateProduct = async (productObject) => {
    try {
        const {
            id,
            barcode,
            name,
            description,
            price,
            stock_quantity,
            variants,
        } = productObject;

        let queryText = "UPDATE products SET ";
        const queryParams = [];
        const setClauses = [];

        // Build dynamic set clause based on provided fields
        if (barcode) {
            queryParams.push(barcode);
            setClauses.push(`barcode = $${queryParams.length}`);
        }
        if (name) {
            queryParams.push(name);
            setClauses.push(`name = $${queryParams.length}`);
        }
        if (description) {
            queryParams.push(description);
            setClauses.push(`description = $${queryParams.length}`);
        }
        if (price) {
            queryParams.push(price);
            setClauses.push(`price = $${queryParams.length}`);
        }
        if (stock_quantity) {
            queryParams.push(stock_quantity);
            setClauses.push(`stock_quantity = $${queryParams.length}`);
        }

        // Complete the product update query
        queryParams.push(id);
        queryText +=
            setClauses.join(", ") +
            ` WHERE id = $${queryParams.length} RETURNING *`;

        // Execute product update
        const productResult = await query(queryText, queryParams, true);
        const updatedProduct = productResult.rows[0];

        // Handle variants if provided
        if (variants && variants.length > 0) {
            await updateVariants(id, variants); // Call a separate function to handle variant updates
        }

        // Fetch the updated product with all variants to return a complete response
        const fullProductData = await this.getProductWithVariants(id);
        return fullProductData;
    } catch (error) {
        throw new Error(`Failed to update product: ${error.message}`);
    }
};

exports.deleteProduct = async (productId) => {
    try {
        const queryText = "DELETE FROM products WHERE id = $1";
        const queryParams = [productId];
        const results = query(queryText, queryParams, true);
        return results.rowCount;
    } catch (error) {
        throw new Error(error);
    }
};

exports.getProductWithVariants = async (productId) => {
    try {
        const queryText = `
            SELECT 
    products.*,
    COALESCE(json_agg(product_variants_with_attributes), '[]') AS variants
FROM 
    products
LEFT JOIN (
    SELECT 
        pv.product_id,
        json_build_object(
            'price', pv.price,
            'stock_quantity', pv.stock_quantity,
            'attributes', json_agg(
                json_build_object(
                    'attribute_name', a.attribute_name,
                    'value', av.value
                )
            )
        ) AS product_variants_with_attributes
    FROM 
        product_variants pv
    LEFT JOIN 
        variant_attribute_values vav ON pv.id = vav.product_variant_id
    LEFT JOIN 
        attribute_values av ON vav.attribute_value_id = av.id
    LEFT JOIN 
        attributes a ON av.attribute_id = a.id
    GROUP BY 
        pv.id
) product_variants_aggregated ON products.id = product_variants_aggregated.product_id
WHERE 
    products.id = $1
GROUP BY 
    products.id;

        `;

        const result = await query(queryText, [productId], true);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
};
