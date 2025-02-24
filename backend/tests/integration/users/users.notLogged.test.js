const request = require("supertest");
const express = require("express");
const userRoutes = require("../../../routes/user-routes");
const db = require("../../../config/db");
const userModel = require("../../../models/user-model");
const dbSeed = require("../../db_seeding/dbSeed");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

  describe("POST /user/recovery/verify", () => {
    // verify the user code and allow user to change password
    it("should return status:verified if code is correct", async () => {
      const email = "testUser99@email.com";
      await request(app)
        .post("/user/recovery")
        .set("Content_Type", "application/json")
        .send({ email });
      const passwordCode = await db.query(
        "SELECT reset_code FROM reset_password_codes WHERE email = $1",
        [email]
      );
      const code = passwordCode.rows[0].reset_code;
      const response = await request(app)
        .post(`/user/recovery/verify`)
        .set("Content-Type", "application/json")
        .send({ code });
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("verified");
    }, 10000);
    it("should return status 400:unverified if code is incorrect", async () => {
      const response = await request(app)
        .post(`/user/recovery/verify`)
        .set("Content-Type", "application/json")
        .send({ code: "notAcode" });
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("unverified");
    });
    it("should return status 400 if time has expired", async () => {
      const email = "testUser99@email.com";
      await request(app)
        .post("/user/recovery")
        .set("Content_Type", "application/json")
        .send({ email });
      const passwordCode = await db.query(
        "SELECT reset_code FROM reset_password_codes WHERE email = $1",
        [email]
      );
      const code = passwordCode.rows[0].reset_code;
      await db.query(
        "UPDATE reset_password_codes SET expire_time = $1 WHERE email = $2",
        [new Date(Date.now() - 15 * 60 * 1000), email]
      );
      const response = await request(app)
        .post(`/user/recovery/verify`)
        .set("Content-Type", "application/json")
        .send({ code });
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("unverified");
    });
    it("should return status 400 if missing code", async () => {
      const response = await request(app)
        .post(`/user/recovery/verify`)
        .set("Content-Type", "application/json");
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Bad Request: Missing code");
    });
    it("should return status 500 if there is a server error.", async () => {
      const originalVerifyPasswordCode = userModel.verifyPasswordCode;
      userModel.verifyPasswordCode = jest.fn(() => {
        throw new Error("Server Error");
      });
      const code = "notAcode";
      const results = await request(app)
        .post(`/user/recovery/verify`)
        .set("Content-Type", "application/json")
        .send({ code });
      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      userModel.verifyPasswordCode = originalVerifyPasswordCode;
    });
  });
  describe("POST /user/recovery", () => {
    // generate a code and send an email to the user.
    it("should generate a password code for the user's email for recovery and put within the reset table", async () => {
      //Arrange
      const email = "testUser99@email.com";
      //Act
      const response = await request(app)
        .post("/user/recovery")
        .set("Content-Type", "application/json")
        .send({ email });
      //Assert
      expect(response.status).toBe(200);
      const dbResult = await db.query(
        "SELECT * FROM reset_password_codes WHERE email = $1",
        [email]
      );
      expect(dbResult.rows.length).toBe(1); // Verify that a row was created
      expect(dbResult.rows[0].reset_code).toBeDefined(); // Verify that a code exists
      expect(dbResult.rows[0].reset_code).not.toBeNull(); // Make sure it's not null
      expect(typeof dbResult.rows[0].reset_code).toBe("string"); // Check code is string
      expect(dbResult.rows[0].reset_code.length).toBeGreaterThan(0); // Check code is not empty
      expect(dbResult.rows[0].expire_time).toBeDefined(); // Verify that an expiration time exists
      const expireTime = new Date(dbResult.rows[0].expire_time);
      const currentTime = new Date();
      const timeDifference = (expireTime - currentTime) / 1000 / 60; // difference in minutes
      expect(timeDifference).toBeGreaterThan(14);
      expect(timeDifference).toBeLessThan(16);
    });
    it("should return status 404 if the email is not found", async () => {
      const email = "notAnEmail";
      const response = await request(app)
        .post("/user/recovery")
        .set("Content-Type", "application/json")
        .send({ email });
      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Email not found.");
    });
    it("should return status 400 if missing email", async () => {
      const response = await request(app)
        .post("/user/recovery")
        .set("Content-Type", "application/json");
      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Bad Request: Missing email address");
    });
    it("should return status 500 if there is a server error.", async () => {
      const originalSetPasswordRecovery = userModel.setPasswordRecovery;
      userModel.setPasswordRecovery = jest.fn(() => {
        throw new Error("Server Error");
      });
      const email = "testEmail";
      const results = await request(app)
        .post(`/user/recovery`)
        .set("Content-Type", "application/json")
        .send({ email });
      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      userModel.setPasswordRecovery = originalSetPasswordRecovery;
    });
  });
  describe("POST /user/recovery/update", () => {
    beforeEach(async () => {
      //Arrange
      const email = "testUser99@email.com";
      //Act
      const response = await request(app)
        .post("/user/recovery")
        .set("Content-Type", "application/json")
        .send({ email });
      //Assert
      expect(response.status).toBe(200);
      const dbResult = await db.query(
        "SELECT * FROM reset_password_codes WHERE email = $1",
        [email]
      );
      this.generatedCode = dbResult.rows[0].reset_code;
      this.email = dbResult.rows[0].email;
    });
    afterEach(async () => {
      await dbSeed.cleanupDbPasswordReset();
    });
    // reset the password of the account with the associated code
    it("should change the password with the correct code and remove the instance of the code in the reset_password_codes table", async () => {
      const newPassword = "newPassword";
      const results = await request(app)
        .post(`/user/recovery/update`)
        .set("Content-Type", "application/json")
        .send({ code: this.generatedCode, password: newPassword });
      const accountResults = await db.query(
        "SELECT * FROM accounts WHERE email = $1",
        [this.email]
      );
      expect(results.status).toBe(200);
      expect(results.body).toBeDefined();
      expect(results.body).toHaveProperty("message");
      expect(results.body.message).toBe("Password updated");
      expect(accountResults.rows[0].password).toBe(newPassword);

      const dbResult = await db.query(
        "SELECT * FROM reset_password_codes WHERE email = $1",
        [this.email]
      );
      expect(dbResult.rows.length).toBe(0);
    });
    it("should return 400 if the code is incorrect", async () => {
      const code = "notAcode";
      const password = "newPassword";
      const results = await request(app)
        .post(`/user/recovery/update`)
        .set("Content-Type", "application/json")
        .send({ code, password });
      expect(results.status).toBe(400);
      expect(results.body).toBeDefined();
      expect(results.body).toHaveProperty("message");
      expect(results.body.message).toBe("unverified");
    });
    it("should return status 500 if there is a server error.", async () => {
      const originalUpdatePasswordWithRecovery =
        userModel.updatePasswordWithRecovery;
      userModel.updatePasswordWithRecovery = jest.fn(() => {
        throw new Error("Server Error");
      });
      const code = "notAcode";
      const password = "newPassword";
      const results = await request(app)
        .post(`/user/recovery/update`)
        .set("Content-Type", "application/json")
        .send({ code, password });
      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      userModel.updatePasswordWithRecovery = originalUpdatePasswordWithRecovery;
    });
  });
  describe("POST /user/register", () => {
    it("should return 200 if user is created", async () => {});
    it("should return 400 if email is missing", async () => {});
    it("should return 400 if email is invalid", async () => {});
    it("should return 400 if username is missing", async () => {});
    it("should return 400 if password is missing", async () => {});
    it("should return 400 if password is invalid", async () => {});
    it("should return 409 if email already exists", async () => {});
  });
  describe("GET /user/:id", () => {
    it("should return 401 if the user is not an admin", async () => {
      const res = await request(app).get(`/user/testUser99@email.com`);
      expect(res.statusCode).toEqual(401);
    });
  });
  describe("PUT /user", () => {
    it("should return 401 if the user is not logged in", async () => {
      const res = await request(app).get(`/user`);
      expect(res.statusCode).toEqual(401);
    });
  });
  describe("DELETE /user/:id", () => {
    it("should return 403 if the user is not an admin", async () => {
      const res = await request(app).get(`/user`);
      expect(res.statusCode).toEqual(403);
    });
  });
});
