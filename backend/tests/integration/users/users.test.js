const request = require("supertest");
const express = require("express");
const userRoutes = require("../../../routes/user-routes");
const db = require("../../../config/db");
const userModel = require("../../../models/user-model");
const dbSeed = require("../../db_seeding/dbSeed");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "testUser99@email.com", username: "testUser" };
  next();
});

app.use("/user", userRoutes);

describe("Users Endpoints Integration Tests", () => {
  beforeAll(async () => {
    await dbSeed.seedAll();
  });

  afterEach(async () => {
    await dbSeed.cleanupDbPasswordReset();
  });

  afterAll(async () => {
    await dbSeed.cleanupDbSeed();
  });

  describe("GET /users/:id", () => {
    it("should return 403 if the user is not an admin", async () => {
      const res = await request(app).get(`/user/testUser99@email.com`);
      expect(res.statusCode).toEqual(403);
    });
  });
  describe("GET /user", () => {
    it("should get the user's object only if the user is the same user", async () => {
      const res = await request(app).get(`/user`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("email");
      expect(res.body.email).toEqual(testId);
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("phone");
      expect(res.body).toHaveProperty("address");
    });
    it("should return 403 if the user is not logged in", async () => {
      const res = await request(app).get(`/user`);
      expect(res.statusCode).toEqual(403);
    });
  });
  describe("PUT /user", () => {
    it("should update a user's object if the user is the same user", async () => {});
  });
  describe("DELETE /user", () => {
    it("should delete a user's object if the user is the same user", async () => {});
  });
});
