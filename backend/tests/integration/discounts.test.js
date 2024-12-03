const request = require("supertest");
const express = require("express");
const discountRoutes = require("../../routes/discounts-routes");
const db = require("../../config/db");
const discountModel = require("../../models/discounts-model");

// jest.mock("../../models/discounts-model", () => ({
//   getDiscountedProducts,
//   getDiscountByCode,
//   addDiscountToProduct,
//   removeDiscountFromProduct,
//   deleteDiscount,
//   getDiscount,
//   createDiscount,
//   getDiscounts,
// }));

const app = express();

// mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "admin@email.com", username: "adminTest", role: "admin" };
  next();
});

app.use("/discounts", discountRoutes);

describe("Discounts Endpoints Integration Tests", () => {
  let testDiscountId = 1;
  let testCategoryId = 1;
  beforeAll(async () => {
    const seedDiscounts = async (discounts) => {
      try {
        const queries = discounts.map((discount) => {
          const { code, percent_off, expire_date } = discount;
          return db.query(
            `INSERT INTO discounts (code, percent_off, expire_date) 
                     VALUES ($1, $2, $3) 
                     RETURNING *`,
            [code, percent_off, expire_date]
          );
        });
        await Promise.all(queries);
      } catch (error) {
        throw new Error(error);
      }
    };

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
    testDiscountId = discountResults.rows[0].id;

    const productResults = await db.query(
      `SELECT id FROM products ORDER BY barcode`
    );
    const productIds = productResults.rows.map((row) => row.id);

    const categoryResults = await db.query(`SELECT * FROM categories`);

    const discountIds = discountResults.rows.map((row) => {
      return row.id;
    });

    testCategoryId = categoryResults.rows[0].id;

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
      { product_id: productIds[0].id, category_id: testCategoryId },
      { product_id: productIds[1].id, category_id: testCategoryId },
    ]);
  });

  afterAll(async () => {
    const cleanupDiscounts = async () => {
      try {
        await db.query(`
          DELETE FROM products_discounts;
          DELETE FROM discounts;
          DELETE FROM products;
        `);
        await db.testPool.end();
        console.log("Cleaned up discounts and closed database pool.");
      } catch (error) {
        throw new Error(error);
      }
    };

    await cleanupDiscounts();
  });

  describe("GET /discounts", () => {
    it("should get all discounts", async () => {
      // arrange

      // act
      const response = await request(app).get("/discounts");

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThan(0); // Check if it's not empty

      // Check the properties of the first discount object (example)
      const firstDiscount = response.body[0];
      expect(firstDiscount).toHaveProperty("id");
      expect(firstDiscount).toHaveProperty("code");
      expect(firstDiscount).toHaveProperty("percent_off");
      expect(firstDiscount).toHaveProperty("expire_date");
    });

    it("Should return a specific number of discounts based on limit", async () => {
      // arrange
      const limit = 1;

      // act
      const response = await request(app).get(`/discounts?limit=${limit}`);

      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(limit);
    });

    it("Should return a specific number based on category ID", async () => {
      // arrange
      const categoryId = testCategoryId;

      // act
      const response = await request(app).get(
        `/discounts?categoryId=${categoryId}`
      );

      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should return 500 status code if an error occurs", async () => {
      // Arrange
      const originalModelGet = discountModel.getDiscounts;
      discountModel.getDiscounts = jest.fn(async () => {
        throw new Error("Fake Error");
      });

      // Act
      const response = await request(app).get("/discounts");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Server Error: Fake Error"
      ); // Updated message

      // Restore the original db.query function
      discountModel.getDiscounts = originalModelGet;
    });
  });

  describe("GET /discounts/:id", () => {
    it("should get a discount by id", async () => {
      // arrange
      const discountId = testDiscountId;

      // act
      const response = await request(app).get(`/discounts/${discountId}`);
      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("id", discountId);
    });
  });
});
