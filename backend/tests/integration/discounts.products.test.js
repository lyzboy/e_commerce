const request = require("supertest");
const express = require("express");
const discountRoutes = require("../../routes/discounts-routes");
const db = require("../../config/db");
const discountModel = require("../../models/discounts-model");
const dbSeed = require("../db_seeding/dbSeed");

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    await dbSeed.cleanupDbSeed();
  });

  describe("GET /discounts/products", () => {
    it("should get all products with discounts", async () => {
      // arrange

      // act
      const response = await request(app).get("/discounts/products");
      //assert
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0); // Check if it's not empty

      // Check the properties of the first discount object (example)
      const firstDiscount = response.body[0];
      expect(firstDiscount).toBeDefined();
      expect(firstDiscount).toHaveProperty("id");
      expect(firstDiscount).toHaveProperty("name");
      expect(firstDiscount).toHaveProperty("price");
      expect(firstDiscount).toHaveProperty("percent_off");
    });
    it("should return a specific number of products based on limit", async () => {
      // arrange
      const limit = 1;
      const results = await request(app).get(
        `/discounts/products?limit=${limit}`
      );
      expect(results.status).toBe(200);
      expect(results.body).toBeDefined();
      expect(results.body.length).toBe(limit);
    });
    it("should return a specific number of products based on page", async () => {
      // arrange
      const limit = 1;
      const page = 1;
      const results = await request(app).get(
        `/discounts/products?limit=${limit}&page=${page}`
      );
      expect(results.status).toBe(200);
      expect(results.body).toBeDefined();
      expect(results.body.length).toBe(limit);
    });
    it("should return 404 status code if no products with discounts are found", async () => {
      // Arrange
      const originalModelGet = discountModel.getDiscountedProducts;
      discountModel.getDiscountedProducts = jest.fn(async () => {
        return [];
      });
      // act
      const response = await request(app).get("/discounts/products");

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "No discounted products found."
      );

      discountModel.getDiscountedProducts = originalModelGet;
    });
    it("should return 500 status code if an error occurs", async () => {
      // Arrange
      const originalModelGet = discountModel.getDiscountedProducts;
      discountModel.getDiscountedProducts = jest.fn(async () => {
        throw new Error("Fake Error");
      });

      // Act
      const response = await request(app).get("/discounts/products");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Server error: Fake Error"
      ); // Updated message

      // Restore the original db.query function
      discountModel.getDiscountedProducts = originalModelGet;
    });
  });
  describe("POST /discounts/products", () => {
    it("should add a discount to a product", async () => {
      // arrange
      const productId = dbSeed.testProductId;
      const discountId = dbSeed.testDiscountId;
      // act
      const response = await request(app)
        .post("/discounts/products")
        .set("Content-Type", "application/json")
        .send({ productId, discountId });

      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("productId", productId);
      expect(response.body).toHaveProperty("discountId", discountId);
      expect(response.body).toHaveProperty("productVariantId");
    });
    it("should return 500 status code if an error occurs", async () => {
      // Arrange
      const originalModelPost = discountModel.addDiscountToProduct;
      discountModel.addDiscountToProduct = jest.fn(async () => {
        throw new Error("Fake Error");
      });

      // Act
      const response = await request(app)
        .post("/discounts/products")
        .set("Content-Type", "application/json")
        .send({ productId: 1, discountId: 1 });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Server Error: Fake Error"
      ); // Updated message

      // Restore the original db.query function
      discountModel.addDiscountToProduct = originalModelPost;
    });
  });
  describe("DELETE /discounts/products", () => {
    it("should delete a discount from a product by productDiscountId", async () => {
      const productDiscountId = dbSeed.testProductDiscountId;
      const response = await request(app)
        .delete("/discounts/products")
        .set("Content-Type", "application/json")
        .send({ productDiscountId });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Discount removed from product"
      );
    });
    it("should delete a discount from a product by productId and discountId", async () => {
      // arrange
      const productId = dbSeed.testProductId;
      const discountId = dbSeed.testDiscountId;

      // act
      const response = await request(app)
        .delete("/discounts/products")
        .set("Content-Type", "application/json")
        .send({ productId, discountId });
      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Discount removed from product"
      );
    });

    it("should return 404 if no discount on product is found", async () => {
      const response = await request(app)
        .delete("/discounts/products")
        .set("Content-Type", "application/json")
        .send({ productId: 9999, discountId: 9999 });
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Discount not found on product."
      );
    });
    it("should return 400 status code if invalid request object", async () => {
      const response = await request(app)
        .delete("/discounts/products")
        .set("Content-Type", "application/json")
        .send({ productId: 1 });
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Invalid request object."
      );
    });
    it("should return 500 status code if an error occurs", async () => {
      const originalModelDelete = discountModel.removeDiscountFromProduct;
      discountModel.removeDiscountFromProduct = jest.fn(async () => {
        throw new Error("Fake Error");
      });
      const response = await request(app)
        .delete("/discounts/products")
        .set("Content-Type", "application/json")
        .send({ productId: 1, discountId: 1 });
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Server Error: Fake Error"
      );
      discountModel.removeDiscountFromProduct = originalModelDelete;
    });
  });
});
