const request = require("supertest");
const express = require("express");
const userRoutes = require("../../../routes/user-routes");
const db = require("../../../config/db");
const userModel = require("../../../models/user-model");
const dbSeed = require("../../db_seeding/dbSeed");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mock authentication middleware
// app.use((req, res, next) => {
//   req.user = { email: "testUser99@email.com", username: "testUser" };
//   next();
// });

app.use("/user", userRoutes);

describe("Users Endpoints Integration Tests", () => {
  beforeAll(async () => {
    await dbSeed.seedAll();
  });

  afterAll(async () => {
    await dbSeed.cleanupDbSeed();
  });

  // *** EXAMPLES ***
  // it("should return 500 status code if an error occurs", async () => {
  //   const originalModelDelete = discountModel.removeDiscountFromProduct;
  //   discountModel.removeDiscountFromProduct = jest.fn(async () => {
  //     throw new Error("Fake Error");
  //   });
  //   const response = await request(app)
  //     .delete("/discounts/products")
  //     .set("Content-Type", "application/json")
  //     .send({ productId: 1, discountId: 1 });
  //   expect(response.status).toBe(500);
  //   expect(response.body).toBeDefined();
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "Server Error: Fake Error"
  //   );
  //   discountModel.removeDiscountFromProduct = originalModelDelete;
  // });

  // // create a new account
  // const newAdmin = Object.values({
  //   email: "aTestAdmin@email.com",
  //   username: "aTestAdmin",
  //   password: "aTestAdminPassword",
  // });
  // beforeEach(async () => {
  //   await dbSeed.testQuery(
  //     `INSERT INTO accounts (email, username, password) Values ($1, $2, $3)`,
  //     newAdmin
  //   );
  // });
  // afterEach(async () => {
  //   await dbSeed.testQuery(`DELETE FROM admins WHERE account_email = $1`, [
  //     newAdmin[0],
  //   ]);
  //   await dbSeed.testQuery(`DELETE FROM accounts WHERE email = $1`, [
  //     newAdmin[0],
  //   ]);
  // });

  // it("should remove a admin from the database", async () => {
  //   await dbSeed.testQuery("INSERT INTO admins (account_email) VALUES ($1)", [
  //     newAdmin[0],
  //   ]);
  //   const response = await request(app).delete("/auth/admin").send({
  //     email: newAdmin[0],
  //   });
  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeDefined();
  //   expect(response.body).toHaveProperty("message");
  //   expect(response.body.message).toBe("Admin removed");
  // });

  describe("POST /user/verify", () => {
    // verify the user code and allow user to change password
    it("should return status:verified if code is correct", async () => {});
    it("should return status:unverified if code is incorrect", async () => {});
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
        "SELECT reset_code FROM reset_password_codes WHERE email = $1",
        [email]
      );
      expect(dbResult.rows.length).toBe(1); // Verify that a row was created
      expect(dbResult.rows[0].reset_code).toBeDefined(); // Verify that a code exists
      expect(dbResult.rows[0].reset_code).not.toBeNull(); // Make sure it's not null
      expect(typeof dbResult.rows[0].reset_code).toBe("string"); // Check code is string
      expect(dbResult.rows[0].reset_code.length).toBeGreaterThan(0); // Check code is not empty
    });
    it("should set an expiration date for the code", async () => {});
    it("should return status 400 if the email is not found", async () => {});
    it("should return status 500 if there is a server error.", async () => {});
  });
  describe("POST /user/recovery/:code", () => {
    // reset the password of the account with the associated code
    it("should change the password with the correct code", async () => {
      // TODO: populate the test database with a user password recover code.

      const results = await request(app).post("/user/recovery/1234");
      // .set("Content-Type", "application/json")
      // .send({ productDiscountId });
    });
    it("should return status 500 if there is a server error.", async () => {});
    it("should return 401 if the code is incorrect", async () => {});
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
