const request = require("supertest");
const express = require("express");
const userRoutes = require("../../../routes/user-routes");
const db = require("../../../config/db");
const userModel = require("../../../models/user-model");
const dbSeed = require("../../db_seeding/dbSeed");
const authentication = require("../../../middlewares/authentication");
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
      expect(res.body.email).toEqual("testUser99@email.com");
      expect(res.body).toHaveProperty("username");
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("phone");
      expect(res.body).toHaveProperty("address");
    });
  });
  describe("PUT /user", () => {
    it("should update a user's object if the user is the same user", async () => {
      const changeUsername = "changedTestUser";
      const changeName = "changedTestName";
      const changedPassword = "changedTestPassword";
      const changedPhone = "9705555555";
      const changedAddress = {
        streetName: "changedTestAddress",
        city: "newCity",
        state: "CO",
      };
      const res = await request(app).put(`/user`).send({
        email: "testUser99@email.com",
        username: changeUsername,
        name: changeName,
        password: changedPassword,
        phone: changedPhone,
        address: changedAddress,
      });
      expect(res.statusCode).toEqual(200);
      const newUserInfo = await request(app).get(`/user`);
      expect(newUserInfo.body.username).toEqual(changeUsername);
      expect(newUserInfo.body.name).toEqual(changeName);
      expect(newUserInfo.body.phone).toEqual(changedPhone);
      expect(newUserInfo.body.address).toEqual(changedAddress);
      const userPassword = await db.query(
        `SELECT password FROM accounts WHERE email = $1`,
        ["testUser99@email.com"],
        true
      );
      expect(userPassword.rows[0].password).toEqual(
        authentication.createHashedPassword(changedPassword)
      );
    });
  });
  describe("DELETE /user", () => {
    it("should delete a user's object if the user is the same user", async () => {
      const res = await request(app).delete(`/user`);
      expect(res.statusCode).toEqual(200);
      const user = await db.query(
        `SELECT * FROM accounts WHERE email = $1`,
        ["testUser99@email.com"],
        true
      );
      expect(user.rows.length).toEqual(0);
    });
  });
});
