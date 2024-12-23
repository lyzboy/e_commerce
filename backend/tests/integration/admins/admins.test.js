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
  // create a new account
  const newAdmin = Object.values({
    email: "aTestAdmin@email.com",
    username: "aTestAdmin",
    password: "aTestAdminPassword",
  });
  beforeEach(async () => {
    await dbSeed.testQuery(
      `INSERT INTO accounts (email, username, password) Values ($1, $2, $3)`,
      newAdmin
    );
  });
  afterEach(async () => {
    await dbSeed.testQuery(`DELETE FROM admins WHERE account_email = $1`, [
      newAdmin[0],
    ]);
    await dbSeed.testQuery(`DELETE FROM accounts WHERE email = $1`, [
      newAdmin[0],
    ]);
  });
  describe("POST /auth/admin", () => {
    it("should add a admin to the database", async () => {
      const response = await request(app).post("/auth/admin").send({
        email: "aTestAdmin@email.com",
      });
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Admin created");
    });
    it("should return 404 if admin already exists", async () => {
      try {
        await dbSeed.testQuery(
          "INSERT INTO admins (account_email) VALUES ($1)",
          [newAdmin[0]]
        );
        const response = await request(app).post("/auth/admin").send({
          email: newAdmin[0],
        });
        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Admin already exists");
      } catch (error) {
        console.log("Error in test", error);
      }
    });
    it("should return 500 if server error occurs", async () => {
      const originalModelFunc = adminModel.addAdmin;
      adminModel.addAdmin = jest.fn(() => {
        throw new Error("Server Error");
      });
      const response = await request(app).post("/auth/admin").send({
        email: newAdmin[0],
      });
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Server Error");
      adminModel.addAdmin = originalModelFunc;
    });
  });
  describe("DELETE /auth/admin", () => {
    it("should remove a admin from the database", async () => {
      await dbSeed.testQuery("INSERT INTO admins (account_email) VALUES ($1)", [
        newAdmin[0],
      ]);
      const response = await request(app).delete("/auth/admin").send({
        email: newAdmin[0],
      });
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Admin removed");
    });
    it("should return 404 if admin does not exist", async () => {
      const response = await request(app).delete("/auth/admin").send({
        email: newAdmin[0],
      });
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Email not found");
    });
    it("should return 500 if server error occurs", async () => {
      const originalModelFunc = adminModel.deleteAdmin;
      adminModel.deleteAdmin = jest.fn(() => {
        throw new Error("Server Error");
      });
      const response = await request(app).delete("/auth/admin").send({
        email: newAdmin[0],
      });
      expect(response.status).toBe(500);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Server Error");
      adminModel.deleteAdmin = originalModelFunc;
    });
  });
});
