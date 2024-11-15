const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const discountRoutes = require("../../routes/discounts-routes");

// Mock the Postgres pool
jest.mock("pg", () => {
  const mPool = {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    }),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock authentication middleware
const mockAuthMiddleware = (req, res, next) => {
  req.user = { role: "admin" };
  next();
};

const app = express();
app.use(bodyParser.json());
app.use(mockAuthMiddleware); // Use the mock authentication middleware
app.use("/discounts", discountRoutes);

describe("Discounts Integration Tests", () => {
  let pool;

  beforeAll(() => {
    pool = new Pool();
  });

  afterAll(() => {
    pool.end();
  });

  it("should get all discounts", async () => {
    const mockDiscounts = [
      { id: 1, percent_off: 10 },
      { id: 2, percent_off: 5 },
    ];
    pool.query.mockResolvedValue({ rows: mockDiscounts });

    const res = await request(app).get("/");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockCategories);
  });

  it("should create a new category", async () => {
    const newDiscount = { percent_off: 15 };
    const mockDiscounts = { id: 3, ...newCategory };
    pool.query.mockResolvedValue({ rows: [mockDiscounts] });

    const res = await request(app).post("/").send(newDiscount);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(mockDiscounts);
  });

  it("should update a category", async () => {
    const updatedCategory = { id: 1, name: "Updated Electronics" };
    pool.query.mockResolvedValue({ rows: [updatedCategory] });

    const res = await request(app).put("/categories/1").send(updatedCategory);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(updatedCategory);
  });

  it("should delete a category", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const res = await request(app).delete("/categories/1");

    expect(res.statusCode).toEqual(204);
  });
});
