const request = require("supertest");
const express = require("express");
const discountRoutes = require("../../routes/discounts-routes");
const db = require("../../config/db");

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
    ]);
    // Retrieve the IDs
    const discountResults = await db.query(
      `SELECT id FROM discounts ORDER BY code`
    );
    const productResults = await db.query(
      `SELECT id FROM products ORDER BY barcode`
    );

    const discountIds = discountResults.rows.map((row) => {
      return row.id;
    });
    const productIds = productResults.rows.map((row) => row.id);
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
    const productsDiscountsResults = await db.query(
      `SELECT id FROM products_discounts`
    );
    const productsDiscountsIds = productsDiscountsResults.rows.map(
      (row) => row.id
    );
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
  });
  describe("GET /discounts/:id", () => {
    it("should get a discount by id", async () => {
      // arrange
      const discountId = 1;

      // act
      const response = await request(app).get(`/discounts/${discountId}`);
      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("id", discountId);
    });
  });
});
