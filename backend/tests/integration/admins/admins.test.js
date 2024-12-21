const request = require("supertest");
const express = require("express");
const authRoutes = require("../../../routes/auth-routes");
const db = require("../../../config/db");
const adminModel = require("../../../models/admin-model");
const dbSeed = require("../../db_seeding/dbSeed");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "admin@email.com", username: "adminTest", role: "admin" };
  next();
});

app.use("/auth", authRoutes);

describe("Admins Endpoints Integration Tests", () => {
  beforeAll(async () => {
    await dbSeed.seedAll();
  });

  afterAll(async () => {
    await dbSeed.cleanupDbSeed();
  });
  describe("POST /auth/admin", () => {
    it("should add a admin to the database", async () => {});
    it("should return 404 if admin already exists", async () => {});
    it("should return 500 if server error occurs", async () => {});
  });
  describe("DELETE /auth/admin", () => {
    it("should remove a admin from the database", async () => {});
    it("should return 404 if admin does not exist", async () => {});
    it("should return 500 if server error occurs", async () => {});
  });
});
