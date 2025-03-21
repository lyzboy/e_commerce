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
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };
      const response = await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(newHero);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(newHero);
    });
    it("should return 400 status code if there is a validation error", async () => {
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };

      // Temporarily override the mock middleware for this specific test
      const appWithMockUser = express();
      appWithMockUser.use(express.json());
      appWithMockUser.use(express.urlencoded({ extended: true }));

      // Mock a non-admin user
      appWithMockUser.use((req, res, next) => {
        req.user = {
          email: "notAdmin@email.com",
          username: "notAdmin",
        };
        next();
      });

      appWithMockUser.use("/heros", herosRoutes);

      const response = await request(appWithMockUser)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(newHero);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Unauthorized: Access Denied");
    });
    it("should return 500 status code if there is an error", async () => {
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };

      const originalCreateHero = herosModel.createHero;
      herosModel.createHero = jest.fn(() => {
        throw new Error("Server Error");
      });

      const results = await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(newHero);

      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      herosModel.createHero = originalCreateHero;
    });
    it("should return 400 status code if the object is empty", async () => {
      const newHero = {};
      const response = await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(newHero);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad Request: Invalid data.");
    });
    it("should return 400 status code if the object is missing required fields", async () => {
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
      };
      const response = await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(newHero);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Bad Request: Invalid data.");
    });
  });
  describe("PUT /heros/:id", () => {
    it("should update a hero", async () => {
      // create a new hero to update
      const origHero = {
        layout: 1, // integer of the type of layout
        heading: "Orig Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };
      await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(origHero);
      // update the hero
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };
      const response = await request(app)
        .put("/heros/1")
        .set("Content-Type", "application/json")
        .send(newHero);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(newHero);
    });
    it("should return 404 status code if hero is not found", async () => {
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };
      const response = await request(app)
        .put("/heros/999")
        .set("Content-Type", "application/json")
        .send(newHero);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Hero not found.");
    });
    it("should return 400 status code if there is a validation error", async () => {
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };

      // Temporarily override the mock middleware for this specific test
      const appWithMockUser = express();
      appWithMockUser.use(express.json());
      appWithMockUser.use(express.urlencoded({ extended: true }));

      // Mock a non-admin user
      appWithMockUser.use((req, res, next) => {
        req.user = {
          email: "notAnAdmin@email.com",
          username: "notAnAdmin",
        };
        next();
      });
      appWithMockUser
        .use("/heros", herosRoutes)
        .set("Content-Type", "application/json")
        .send(newHero);
      const response = await request(appWithMockUser).put("/heros/1");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Unauthorized: Access Denied");
    });
    it("should return 500 status code if there is an error", async () => {
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };

      const originalUpdateHero = herosModel.updateHero;
      herosModel.updateHero = jest.fn(() => {
        throw new Error("Server Error");
      });

      const results = await request(app)
        .put("/heros/1")
        .set("Content-Type", "application/json")
        .send(newHero);

      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      herosModel.updateHero = originalUpdateHero;
    });
  });
  describe("DELETE /heros/:id", () => {
    it("should delete a hero", async () => {
      const newHero = {
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };
      await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(newHero);
      const response = await request(app).delete("/heros/1");
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Hero deleted successfully.");
    });
    it("should return 404 status code if hero is not found", async () => {
      const response = await request(app).delete("/heros/999");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Hero not found.");
    });
    it("should return 400 status code if there is a validation error", async () => {
      // Temporarily override the mock middleware for this specific test
      const appWithMockUser = express();
      appWithMockUser.use(express.json());
      appWithMockUser.use(express.urlencoded({ extended: true }));

      // Mock a non-admin user
      appWithMockUser.use((req, res, next) => {
        req.user = {
          email: "notAnAdmin@email.com",
          username: "notAnAdmin",
        };
        next();
      });
      appWithMockUser.use("/heros", herosRoutes);
      const response = await request(appWithMockUser).delete("/heros/1");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Unauthorized: Access Denied");
    });
    it("should return 500 status code if there is an error", async () => {
      const originalDeleteHero = herosModel.deleteHero;
      herosModel.deleteHero = jest.fn(() => {
        throw new Error("Server Error");
      });

      const results = await request(app).delete("/heros/1");

      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      herosModel.deleteHero = originalDeleteHero;
    });
  });
});
