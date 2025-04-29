const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const categoryRoutes = require("../../routes/category-routes");
const dbSeed = require("../db_seeding/dbSeed");
const db = require("../../config/db");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "admin@email.com", username: "adminTest", role: "admin" };
  next();
});

app.use("/categories", categoryRoutes);

describe("Category Integration Tests", () => {
  beforeAll(async () => {
    await dbSeed.seedAll();
  });

  afterAll(async () => {
    await dbSeed.cleanupDbSeed();
  });

  it("GET should get all categories", async () => {
    const res = await request(app).get("/categories");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach((category) => {
      expect(category).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });

  it("POST should create a new category", async () => {
    const newCategory = { name: "Clothing", description: "Clothes you wear." };

    const res = await request(app)
      .post("/categories")
      .set("Content-Type", "application/json")
      .send(newCategory);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        ...newCategory,
        id: expect.any(Number),
      })
    );
  });

  it("PUT should update a category", async () => {
    const retrievedCats = await db.query("SELECT * FROM categories");

    const updatedCategory = {
      id: retrievedCats.rows[0].id,
      name: "Updated Electronics",
      description: "Updated description",
    };

    const res = await request(app)
      .put(`/categories/${retrievedCats.rows[0].id}`)
      .send(updatedCategory);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(updatedCategory);
  });

  it("DELETE should delete a category", async () => {
    const retrievedCats = await db.query("SELECT * FROM categories");

    const res = await request(app).delete(
      `/categories/${retrievedCats.rows[0].id}`
    );

    expect(res.statusCode).toEqual(204);
  });
});
