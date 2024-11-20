const request = require("supertest");
const express = require("express");
const discountRoutes = require("../../routes/discounts-routes");
const discountModel = require("../../models/discounts-model");

jest.mock("../../models/discounts-model", () => ({
  getDiscountedProducts: jest.fn((limit, page, category) => {
    const mockData = [
      { id: 1, name: "Product 1", effective_price: 10 },
      { id: 2, name: "Product 2", effective_price: 20 },
    ];
    return Promise.resolve(mockData);
  }),
  getDiscountByCode: jest.fn((code) => {
    if (code == "10OFF") {
      const mockData = [
        { id: 1, code: "10OFF", percent_off: 10, expire_date: "2022-12-31" },
      ];
      return Promise.resolve(mockData);
    } else {
      return Promise.resolve(null);
    }
  }),
  addDiscountToProduct: jest.fn((productId, discountId, productVariantId) => {
    return Promise.resolve({
      id: 1,
      productId: productId,
      discountId: discountId,
      productVariantId: productVariantId ? productVariantId : null,
    });
  }),
  removeDiscountFromProduct: jest.fn(
    (productDiscountId, productId, discountId, productVariantId) => {
      if (productDiscountId === 1) {
        return Promise.resolve(1);
      } else {
        return Promise.resolve(0);
      }
    }
  ),
  deleteDiscount: jest.fn((id) => {
    if (id === 1) {
      return Promise.resolve(1);
    } else {
      return Promise.resolve(0);
    }
  }),

  getDiscount: jest.fn((id) => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        code: "10OFF",
        percent_off: 10,
        expire_date: "2022-12-31",
      });
    } else {
      return Promise.resolve(null);
    }
  }),

  createDiscount: jest.fn(
    (code, percentOff, amountOff, expireDate, quantity) => {
      return Promise.resolve({
        id: 1,
        code: code,
        percent_off: percentOff,
        amount_off: amountOff,
        expire_date: expireDate,
        quantity: quantity,
      });
    }
  ),

  getDiscounts: jest.fn((limit, page, categoryId) => {
    const mockData = [
      { id: 1, code: "10OFF", percent_off: 10, expire_date: "2022-12-31" },
      { id: 2, code: "20OFF", percent_off: 20, expire_date: "2022-12-31" },
    ];
    return Promise.resolve(mockData);
  }),
}));

const app = express();

// mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "admin@email.com", username: "adminTest", role: "admin" };
  next();
});

app.use("/discounts", discountRoutes);

describe("Discounts Endpoints Integration Tests", () => {
  describe("GET /discounts", () => {
    it("should get all discounts", async () => {
      // arrange
      const mockData = [
        { id: 1, code: "10OFF", percent_off: 10, expire_date: "2022-12-31" },
        { id: 2, code: "20OFF", percent_off: 20, expire_date: "2022-12-31" },
      ];
      discountModel.getDiscounts = jest
        .fn()
        .mockReturnValue(Promise.resolve(mockData));

      // act
      const response = await request(app).get("/discounts");

      //assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
      expect(discountModel.getDiscounts).toHaveBeenCalled();
    });
  });
});
