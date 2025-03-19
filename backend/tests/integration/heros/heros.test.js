const request = require("supertest");
const express = require("express");
const db = require("../../../config/db");
const herosRoutes = require("../../../routes/heros-routes");
const herosModel = require("../../../models/heros-model");
const dbSeed = require("../../db_seeding/dbSeed");
const authentication = require("../../../middlewares/authentication");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mock authentication middleware
app.use((req, res, next) => {
  req.user = {
    email: "adminTest@email.com",
    username: "adminTest",
    role: "admin",
  };
  next();
});

app.use("/heros", herosRoutes);

describe("Heros Endpoints Integration Tests", () => {
  beforeAll(async () => {
    await dbSeed.seedAll();
  });

  afterEach(async () => {
    await dbSeed.cleanupDbPasswordReset();
  });

  afterAll(async () => {
    await dbSeed.cleanupDbSeed();
  });

  describe("GET /heros", () => {
    it("should return all heros", async () => {
      //Arrange
      const heros = await herosModel.getAllHeros();
      //Act
      const response = await request(app).get("/heros");
      //Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual;
      expect(response.body).toEqual(heros);
    });
    it("should return 500 status code if there is an error", async () => {
      const originalGetAllHeros = herosModel.getAllHeros;
      herosModel.getAllHeros = jest.fn(() => {
        throw new Error("Server Error");
      });
      const results = await request(app).get("/heros");
      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      herosModel.getAllHeros = originalGetAllHeros;
    });
    it("should return 404 status code if there are no heros", async () => {
      const originalGetAllHeros = herosModel.getAllHeros;
      herosModel.getAllHeros = jest.fn(() => {
        return [];
      });
      const results = await request(app).get("/heros");
      expect(results.status).toBe(404);
      expect(results.body.message).toBe("No heros found.");
      herosModel.getAllHeros = originalGetAllHeros;
    });
  });
  describe("POST /heros", () => {
    it("should create a new hero", async () => {
      expect(true).toBe(false);
    });
    it("should return 400 status code if there is a validation error", async () => {
      expect(true).toBe(false);
    });
    it("should return 500 status code if there is an error", async () => {
      expect(true).toBe(false);
    });
  });
  describe("PUT /heros/:id", () => {
    it("should update a hero", async () => {
      expect(true).toBe(false);
    });
    it("should return 404 status code if hero is not found", async () => {
      expect(true).toBe(false);
    });
    it("should return 400 status code if there is a validation error", async () => {
      expect(true).toBe(false);
    });
    it("should return 500 status code if there is an error", async () => {
      expect(true).toBe(false);
    });
  });
  describe("DELETE /heros/:id", () => {
    it("should delete a hero", async () => {
      expect(true).toBe(false);
    });
    it("should return 404 status code if hero is not found", async () => {
      expect(true).toBe(false);
    });
    it("should return 500 status code if there is an error", async () => {
      expect(true).toBe(false);
    });
  });
});
