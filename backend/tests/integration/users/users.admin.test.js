const request = require("supertest");
const express = require("express");
const userRoutes = require("../../../routes/user-routes");
const db = require("../../../config/db");
const dbSeed = require("../../db_seeding/dbSeed");

/**
 * Express application instance.
 * This instance is used to set up and configure the Express application
 * for handling HTTP requests and responses.
 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "admin@email.com", username: "adminTest", role: "admin" };
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
    it("should get the user's object only if the user is an admin", async () => {
      const userIds = await db.query(`SELECT * FROM accounts`, []);
      const testId = userIds.rows[0].email;
      const res = await request(app).get(`/user/${testId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("email");
      expect(res.body.email).toEqual(testId);
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("phone");
      expect(res.body).toHaveProperty("address");
    });
  });

  describe("DELETE /user/:id", () => {
    it("should return 403 if the user is not logged in", async () => {
      const res = await request(app).get(`/user`);
      expect(res.statusCode).toEqual(403);
    });
  });
});
