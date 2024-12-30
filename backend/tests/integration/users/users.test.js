const request = require("supertest");
const express = require("express");
//const userRoutes = require("../../../routes/users-routes");
const db = require("../../../config/db");
//const userModel = require("../../../models/users-model");
const dbSeed = require("../../db_seeding/dbSeed");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "admin@email.com", username: "adminTest", role: "admin" };
  next();
});

//app.use("/user", userRoutes);

describe("Users Endpoints Integration Tests", () => {
  beforeAll(async () => {
    await dbSeed.seedAll();
  });

  afterAll(async () => {
    await dbSeed.cleanupDbSeed();
  });
  describe("POST /user/recovery", () => {
    // TODO: figure out correct way to implement password recovery using code.
    it("should send a password code to the user's email for recovery", async () => {});
    it("should update the user's password if the code is correct", async () => {});
  });
  describe("GET /users/:id", () => {
    it("should get the user's object only if the user is an admin", async () => {
      // const code = "DISCOUNT10";
      // const percentOff = 10;
      // const results = await request(app).post(`/discounts/code/${code}`);
      // expect(results.status).toBe(200);
      // expect(results.body.code).toBe(code);
      // expect(results.body.percentOff).toBe(percentOff);
    });
    it("should return 401 if the user is not an admin", async () => {});
  });
  describe("GET /user", () => {
    it("should get the user's object only if the user is the same user and not an admin", async () => {});
    it("should return a 401 if the user is not the correct user", async () => {});
  });
  describe("PUT /user", () => {
    it("should update a user's object if the user is the same user and not an admin", async () => {});
  });
  describe("DELETE /user", () => {
    it("should delete a user's object if the user is the same user and not an admin", async () => {});
  });
});
