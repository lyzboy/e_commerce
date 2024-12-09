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
      expect(typeof firstDiscount.code).toBe("string");
      expect(firstDiscount).toHaveProperty("percentOff");
      expect(typeof firstDiscount.percentOff).toBe("number");
      if (firstDiscount.amountOff !== null) {
        expect(typeof firstDiscount.amountOff).toBe("number");
      } else {
        expect(firstDiscount.amountOff).toBeNull();
      }
      expect(firstDiscount).toHaveProperty("expireDate");
      expect(typeof firstDiscount.expireDate).toBe("string");
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

      // act
      const response = await request(app).get(
        `/discounts?limit=${limit}&page=${page}`
      );
      console.log(
        "GET /discounts?limit=${limit}&page=${page}",
        response.body.message
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.length).toBe(limit);
      expect(["DISCOUNT10", "DISCOUNT20"]).toContain(response.body[0].code);
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
      expect(response.body).toHaveProperty("code");
      expect(typeof response.body.code).toBe("string");
      expect(response.body).toHaveProperty("percentOff");
      expect(typeof response.body.percentOff).toBe("number");
      expect(response.body).toHaveProperty("amountOff");
      if (response.body.amountOff !== null) {
        expect(typeof response.body.amountOff).toBe("number");
      } else {
        expect(response.body.amountOff).toBeNull();
      }
      expect(response.body).toHaveProperty("expireDate");
      expect(typeof response.body.expireDate).toBe("string");
    });
    it("should return 404 status code if discount is not found", async () => {
      // arrange
      const discountId = 9999;

      // act
      const response = await request(app).get(`/discounts/${discountId}`);

      // assert
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message", "Discount not found.");
    });

    it("should return 500 status code if an error occurs", async () => {
      // Arrange
      const originalModelGet = discountModel.getDiscount;
      discountModel.getDiscount = jest.fn(async () => {
        throw new Error("Fake Error");
      });

      // Act
      const response = await request(app).get("/discounts/9999");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Server Error: Fake Error"
      ); // Updated message

      // Restore the original db.query function
      discountModel.getDiscount = originalModelGet;
    });
  });

  describe("POST /discounts", () => {
    it("should create a new discount", async () => {
      const newDiscount = {
        code: "NEWCODE",
        percentOff: 10,
        expireDate: "2022-12-31",
        quantity: 10,
      };

      const response = await request(app)
        .post("/discounts")
        .set("Content-Type", "application/json")
        .send(newDiscount);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toEqual(expect.objectContaining(newDiscount));
      expect(response.body).toHaveProperty("id");
    });
  });
});
