exports.createVariants = async (productId, variants) => {
    try {
        const variantQueries = variants.map((variant) => {
            const { attributeValueIds, price, stock_quantity } = variant;

            return query(
                `INSERT INTO product_variants (product_id, attribute_value_id, price, stock_quantity)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [productId, attributeValueIds, price, stock_quantity]
            );
        });

        // Run all queries asynchronously
        await Promise.all(variantQueries);
    } catch (error) {
        throw new Error(`Failed to create variants: ${error.message}`);
    }
};

exports.updateVariants = async (productId, variants) => {
    try {
        // Retrieve current variants from the database for comparison
        const currentVariantsResult = await query(
            `SELECT * FROM product_variants WHERE product_id = $1`,
            [productId]
        );
        const currentVariants = currentVariantsResult.rows;

        // Separate variants into updates, inserts, and deletions
        const variantsToUpdate = [];
        const variantsToInsert = [];
        const variantsToDelete = currentVariants.filter(
            (cv) => !variants.some((v) => v.id === cv.id)
        );

        // Process each variant in the provided variants array
        variants.forEach((variant) => {
            if (variant.id) {
                // Variant exists, so we should update it
                variantsToUpdate.push(variant);
            } else {
                // New variant, so we should insert it
                variantsToInsert.push(variant);
            }
        });

        // Execute updates
        for (let variant of variantsToUpdate) {
            await query(
                `UPDATE product_variants 
                 SET price = $1, stock_quantity = $2 
                 WHERE id = $3`,
                [variant.price, variant.stock_quantity, variant.id]
            );
        }

        // Execute inserts
        for (let variant of variantsToInsert) {
            await query(
                `INSERT INTO product_variants (product_id, attribute_value_id, price, stock_quantity) 
                 VALUES ($1, $2, $3, $4)`,
                [
                    productId,
                    variant.attribute_value_id,
                    variant.price,
                    variant.stock_quantity,
                ]
            );
        }

        // Execute deletions
        for (let variant of variantsToDelete) {
            await query(`DELETE FROM product_variants WHERE id = $1`, [
                variant.id,
            ]);
        }
    } catch (error) {
        throw new Error(`Failed to update variants: ${error.message}`);
    }
};
