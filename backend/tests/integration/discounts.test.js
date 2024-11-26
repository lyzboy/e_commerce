const request = require("supertest");
const express = require("express");
const discountRoutes = require("../../routes/discounts-routes");
const discountModel = require("../../models/discounts-model");
const { query } = require("../../config/db");

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
  describe("GET /discounts", () => {
    beforeAll(async () => {
      const seedDiscounts = async (discounts) => {
        try {
          const queries = discounts.map((discount) => {
            const { code, percent_off, expire_date } = discount;
            return query(
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

      await seedDiscounts([
        { code: "DISCOUNT10", percent_off: 10, expire_date: "2022-12-31" },
        { code: "DISCOUNT20", percent_off: 20, expire_date: "2022-12-31" },
      ]);
    });

    afterAll(async () => {
      const cleanupDiscounts = async () => {
        try {
          await query("DELETE FROM discounts");
        } catch (error) {
          throw new Error(error);
        }
      };

      await cleanupDiscounts();
    });

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
});
