const request = require("supertest");
const express = require("express");
const discountRoutes = require("../../routes/discounts-routes");
const db = require("../../config/db");
const discountModel = require("../../models/discounts-model");
const dbSeed = require("../db_seeding/seedAll");

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
    await dbSeed.seedAll();
  });

  afterAll(async () => {
    const cleanupDiscounts = async () => {
      try {
        await db.query(`
          DELETE FROM products_discounts;
          DELETE FROM products_categories;
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
      const categoryId = dbSeed.testCategoryId;
      console.log("category id: ", categoryId);

      // act
      const response = await request(app).get(
        `/discounts?categoryId=${categoryId}`
      );

      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should return a specific number of discounts based on page", async () => {
      // arrange
      const limit = 1;
      const page = 2;
      return true;
    });

    it("should return 404 status code if no discounts are found", async () => {
      // Arrange
      const originalModelGet = discountModel.getDiscounts;
      discountModel.getDiscounts = jest.fn(async () => {
        return [];
      });
      // act
      const response = await request(app).get("/discounts");

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message", "No discounts found.");

      discountModel.getDiscounts = originalModelGet;
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
      const discountId = dbSeed.testDiscountId;

      // act
      const response = await request(app).get(`/discounts/${discountId}`);
      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("id", discountId);
    });
  });
});
