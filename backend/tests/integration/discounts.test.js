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
        const queries = products.map((products) => {
          const {barcode, name, description, stock_quantity, price} = product;
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
          const {product_id, discount_id, product_variant_id} = productDiscount;
          return db.query(
            `INSERT INTO product_discounts (product_id, discount_id, product_variant_id) 
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
      { barcode: "123456789", name: "Test Product", description: "Test Description", stock_quantity: 10, price: 100.00 },
      { barcode: "987654321", name: "Test Product 2", description: "Test Description 2", stock_quantity: 20, price: 200.00 },
    ]);
    await seedProductDiscounts([
      { product_id: 1, discount_id: 1, product_variant_id: null },
      { product_id: 2, discount_id: 2, product_variant_id: null },
    ]);
  });

  afterAll(async () => {
    const cleanupDiscounts = async () => {
      try {
        await db.query("DELETE FROM discounts");
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

    it("should return a status of 500 if an error occurs", async () => {
      const originalQuery = db.query;
      db.query = jest.fn(async () => {
        throw new Error("Error executing query");
      });
      try {
        const response = await request(app).get("/discounts");
        expect(response.status).toBe(500);
      } finally {
        db.query = originalQuery;
      }
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
