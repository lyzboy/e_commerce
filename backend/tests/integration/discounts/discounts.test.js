const request = require("supertest");
const express = require("express");
const discountRoutes = require("../../../routes/discounts-routes");
const db = require("../../../config/db");
const discountModel = require("../../../models/discounts-model");
const dbSeed = require("../../db_seeding/dbSeed");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "admin@email.com", username: "adminTest", role: "admin" };
  next();
});

app.use("/discounts", discountRoutes);

const assertDiscountProperties = (discount, discountId) => {
  expect(discount).toBeDefined();
  if (discountId) {
    expect(discount).toHaveProperty("id", discountId);
  } else {
    expect(discount).toHaveProperty("id");
  }
  expect(discount).toHaveProperty("code");
  expect(typeof discount.code).toBe("string");
  expect(discount).toHaveProperty("percentOff");
  expect(typeof discount.percentOff).toBe("number");
  expect(discount).toHaveProperty("amountOff");
  if (discount.amountOff !== null) {
    expect(typeof discount.amountOff).toBe("number");
  } else {
    expect(discount.amountOff).toBeNull();
  }
  expect(discount).toHaveProperty("expireDate");
  expect(typeof discount.expireDate).toBe("string");
};

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
      expect(response.body.length).toBeGreaterThan(0); // Check if it's not empty

      // Check the properties of the first discount object (example)
      const firstDiscount = response.body[0];
      assertDiscountProperties(firstDiscount);
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

    it("should return 400 if percentOff is not provided", async () => {
      const newDiscount = {
        code: "NEWCODE",
        expireDate: "2022-12-31",
        quantity: 10,
      };

      const response = await request(app)
        .post("/discounts")
        .set("Content-Type", "application/json")
        .send(newDiscount);
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Invalid request object."
      );
    });
    it("should return 500 status code if an error occurs", async () => {
      // Arrange
      const originalModelPost = discountModel.createDiscount;
      discountModel.createDiscount = jest.fn(async () => {
        throw new Error("Fake Error");
      });

      // Act
      const response = await request(app)
        .post("/discounts")
        .set("Content-Type", "application/json")
        .send({ percentOff: 40 });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Server Error: Fake Error"
      ); // Updated message

      // Restore the original db.query function
      discountModel.createDiscount = originalModelPost;
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
      assertDiscountProperties(response.body, discountId);
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
      const originalModelGet = discountModel.getDiscountById;
      discountModel.getDiscountById = jest.fn(async () => {
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
      discountModel.getDiscountById = originalModelGet;
    });
  });

  describe("PUT /discounts/:id", () => {
    it("should update a discount by id", async () => {
      // arrange
      const discountId = dbSeed.testDiscountId;
      const updatedDiscount = {
        code: "UPDATEDCODE",
        percentOff: 20,
        expireDate: "2022-12-31",
        quantity: 10,
      };

      // act
      const response = await request(app)
        .put(`/discounts/${discountId}`)
        .set("Content-Type", "application/json")
        .send(updatedDiscount);

      // assert
      expect(response.status).toBe(200);
      assertDiscountProperties(response.body, discountId);
    });

    it("should return 404 status code if discount is not found", async () => {
      // arrange
      const discountId = 9999;
      const updatedDiscount = {
        code: "UPDATEDCODE",
        percentOff: 20,
        expireDate: "2022-12-31",
        quantity: 10,
      };

      // act
      const response = await request(app)
        .put(`/discounts/${discountId}`)
        .set("Content-Type", "application/json")
        .send(updatedDiscount);

      // assert
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message", "Discount not found.");
    });

    it("should return 500 status code if an error occurs", async () => {
      // Arrange
      const originalModelPut = discountModel.getDiscount;
      discountModel.updateDiscount = jest.fn(async () => {
        throw new Error("Fake Error");
      });

      // Act
      const response = await request(app)
        .put("/discounts/9999")
        .set("Content-Type", "application/json")
        .send({ percentOff: 40 });

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Server Error: Fake Error"
      ); // Updated message

      // Restore the original db.query function
      discountModel.getDiscount = originalModelPut;
    });
  });
  describe("DELETE /discounts/:id", () => {
    it("should delete a discount by id", async () => {
      // arrange
      const discountId = dbSeed.testDiscountId;

      // act
      const response = await request(app).delete(`/discounts/${discountId}`);

      // assert
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message", "Discount deleted.");
    });
    it("should return 404 status code if discount is not found", async () => {
      // arrange
      const discountId = 9999;

      // act
      const response = await request(app).delete(`/discounts/${discountId}`);
      // assert
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message", "Discount not found.");
    });
    it("should return 500 status code if an error occurs", async () => {
      // Arrange
      const originalModelDelete = discountModel.deleteDiscount;
      discountModel.deleteDiscount = jest.fn(async () => {
        throw new Error("Fake Error");
      });

      // Act
      const response = await request(app).delete("/discounts/9999");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty(
        "message",
        "Server Error: Fake Error"
      ); // Updated message

      // Restore the original db.query function
      discountModel.deleteDiscount = originalModelDelete;
    });
  });
});
