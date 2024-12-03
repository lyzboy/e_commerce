const db = require("../../config/db");

const seedDiscounts = require("./seedDiscounts");

const dbSeed = {
  testDiscountId: 1,
  testCategoryId: 1,

  seedAll: async function () {
    const seedCategories = async (categories) => {
      try {
        const queries = categories.map((category) => {
          const { name, description } = category;
          return db.query(
            `INSERT INTO categories (name, description) 
                 VALUES ($1, $2) 
                 RETURNING *`,
            [name, description]
          );
        });
        await Promise.all(queries);
      } catch (error) {
        throw new Error(error);
      }
    };

    const seedProducts = async (products) => {
      try {
        const queries = products.map((product) => {
          const { barcode, name, description, stock_quantity, price } = product;
          return db.query(
            `INSERT INTO products (barcode, name, description, stock_quantity, price) 
                   VALUES ($1, $2, $3, $4, $5) 
                   RETURNING *`,
            [barcode, name, description, stock_quantity, price]
          );
        });
        await Promise.all(queries);
      } catch (error) {
        throw new Error(error);
      }
    };

    const seedProductDiscounts = async (productDiscounts) => {
      try {
        const queries = productDiscounts.map((productDiscount) => {
          const { product_id, discount_id, product_variant_id } =
            productDiscount;
          return db.query(
            `INSERT INTO products_discounts (product_id, discount_id, product_variant_id) 
                   VALUES ($1, $2, $3) 
                   RETURNING *`,
            [product_id, discount_id, product_variant_id]
          );
        });
        await Promise.all(queries);
      } catch (error) {
        throw new Error(error);
      }
    };

    const seedProductsCategories = async (productsCategories) => {
      try {
        const queries = productsCategories.map((productCategory) => {
          const { product_id, category_id } = productCategory;
          return db.query(
            `INSERT INTO products_categories (product_id, category_id) 
                   VALUES ($1, $2) 
                   RETURNING *`,
            [product_id, category_id]
          );
        });
        await Promise.all(queries);
      } catch (error) {
        throw new Error(error);
      }
    };

    await seedDiscounts([
      { code: "DISCOUNT10", percent_off: 10, expire_date: "2022-12-31" },
      { code: "DISCOUNT20", percent_off: 20, expire_date: "2022-12-31" },
    ]);

    await seedProducts([
      {
        barcode: "123456789",
        name: "Test Product",
        description: "Test Description",
        stock_quantity: 10,
        price: 100.0,
      },
      {
        barcode: "987654321",
        name: "Test Product 2",
        description: "Test Description 2",
        stock_quantity: 20,
        price: 200.0,
      },
      {
        barcode: "987654568",
        name: "Test Product 3",
        description: "Test Description 3",
        stock_quantity: 5,
        price: 19.99,
      },
    ]);

    await seedCategories([
      { name: "Test Category", description: "Test Description" },
    ]);

    // Retrieve the IDs
    const discountResults = await db.query(
      `SELECT id FROM discounts ORDER BY code`
    );
    this.testDiscountId = discountResults.rows[0].id;

    const productResults = await db.query(
      `SELECT id FROM products ORDER BY barcode`
    );
    const productIds = productResults.rows.map((row) => row.id);

    const categoryResults = await db.query(`SELECT * FROM categories`);

    const discountIds = discountResults.rows.map((row) => {
      return row.id;
    });

    this.testCategoryId = categoryResults.rows[0].id;

    await seedProductDiscounts([
      {
        product_id: productIds[0],
        discount_id: discountIds[0],
        product_variant_id: null,
      },
      {
        product_id: productIds[1],
        discount_id: discountIds[1],
        product_variant_id: null,
      },
    ]);

    await seedProductsCategories([
      { product_id: productIds[0], category_id: this.testCategoryId },
      { product_id: productIds[1], category_id: this.testCategoryId },
    ]);

    const productCategoryResults = await db.query(
      `SELECT * FROM products_categories`
    );
  },
};

module.exports = dbSeed;
