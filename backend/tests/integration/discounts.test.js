const request = require("supertest");
const express = require("express");
const discountRoutes = require("../../routes/discounts-routes");
const discountController = require("../../controllers/discounts-controller");

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
  // addDiscountToProduct (
  //   productId,
  //   discountId,
  //   productVariantId
  // )
  // removeDiscountFromProduct (
  //   productDiscountId,
  //   productId,
  //   discountId,
  //   productVariantId
  // )
  // deleteDiscount (id)

  // getDiscount (id)

  // createDiscount  (
  //   code,
  //   percentOff,
  //   amountOff,
  //   expireDate,
  //   quantity
  // ) => {};

  // getDiscounts (limit, page, categoryId)
}));
