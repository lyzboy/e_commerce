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
  describe("GET /discounts/code/:code", () => {
    it("should return a formatted discount that relates to the code", async () => {
      const code = "DISCOUNT10";
      const percentOff = 10;
      const results = await request(app).post(`/discounts/code/${code}`);
      expect(results.status).toBe(200);
      expect(results.body.code).toBe(code);
      expect(results.body.percentOff).toBe(percentOff);
    });
    it("should return status 404 if discount code does not exist", async () => {
      const code = "DOESNOTEXIST";
      const results = await request(app).post(`/discounts/code/${code}`);

      expect(results.status).toBe(404);
      expect(results.body.message).toBe("Discount not found.");
    });
    it("should return status 500 if server error occurs", async () => {
      const originalGetDiscountByCode = discountModel.getDiscountByCode;
      discountModel.getDiscountByCode = jest.fn(() => {
        throw new Error("Server Error");
      });
      const code = "DISCOUNT10";
      const results = await request(app).post(`/discounts/code/${code}`);
      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      discountModel.getDiscountByCode = originalGetDiscountByCode;
    });
  });
});
