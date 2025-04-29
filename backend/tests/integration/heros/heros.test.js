const request = require("supertest");
const express = require("express");
const db = require("../../../config/db");
const herosRoutes = require("../../../routes/heros-routes");
const herosModel = require("../../../models/heros-model");
const dbSeed = require("../../db_seeding/dbSeed");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mock authentication middleware
app.use((req, res, next) => {
  req.user = { email: "admin@email.com", username: "adminTest", role: "admin" };
  next();
});

app.use("/heros", herosRoutes);

describe("Heros Endpoints Integration Tests", () => {
  beforeAll(async () => {
    await dbSeed.seedAll();
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
    it("should create a new hero with a product", async () => {
      let results = await db.query("SELECT * FROM products");
      const retrievedProductId = results.rows[0].id;
      results = await db.query("SELECT * FROM categories");
      const retrievedCategoryId = results.rows[0].id;
      const newHero = {
        productId: retrievedProductId,
        categoryId: retrievedCategoryId,
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
        imageurl: "www.test.com/image1.jpeg",
      };
      const response = await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(newHero);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ ...newHero, id: expect.any(Number) });
    });
    it("should return 403 status code if there is a validation error", async () => {
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

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Access denied");
    });
    it("should return 500 status code if there is an error", async () => {
      const newHero = {
        productId: 1,
        categoryId: 1,
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
      let results = await db.query("SELECT * FROM products");
      const retrievedProductId = results.rows[0].id;
      results = await db.query("SELECT * FROM categories");
      const retrievedCategoryId = results.rows[0].id;
      // create a new hero to update
      const origHero = {
        productId: retrievedProductId,
        categoryId: retrievedCategoryId,
        layout: 1, // integer of the type of layout
        heading: "Orig Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
        imageurl: "www.test.com/image1.jpeg",
      };
      const tempHeroObject = await request(app)
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
        .put(`/heros/${tempHeroObject.body.id}`)
        .set("Content-Type", "application/json")
        .send(newHero);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...origHero,
        ...newHero,
        id: tempHeroObject.body.id,
      });
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
    it("should return 403 status code if there is a validation error", async () => {
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
      const response = await request(appWithMockUser).put("/heros/1");
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Access denied");
    });
    it("should return 500 status code if there is an error", async () => {
      let results = await db.query("SELECT * FROM products");
      const retrievedProductId = results.rows[0].id;
      results = await db.query("SELECT * FROM categories");
      const retrievedCategoryId = results.rows[0].id;

      // Ensure a hero exists with ID 1
      const existingHero = {
        productId: retrievedProductId,
        categoryId: retrievedCategoryId,
        layout: 1,
        heading: "Existing Hero",
        subTitle1: "Subtitle 1",
        subTitle2: "Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
        imageurl: "www.test.com/image1.jpeg",
      };
      const createdHero = await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(existingHero);

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

      results = await request(app)
        .put(`/heros/${createdHero.body.id}`)
        .set("Content-Type", "application/json")
        .send(newHero);

      expect(results.status).toBe(500);
      expect(results.body.message).toBe("Server Error: Server Error");
      herosModel.updateHero = originalUpdateHero;
    });
  });
  describe("DELETE /heros/:id", () => {
    it("should delete a hero", async () => {
      let results = await db.query("SELECT * FROM products");
      const retrievedProductId = results.rows[0].id;
      results = await db.query("SELECT * FROM categories");
      const retrievedCategoryId = results.rows[0].id;
      const newHero = {
        productId: retrievedProductId,
        categoryId: retrievedCategoryId,
        layout: 1, // integer of the type of layout
        heading: "Test Heading",
        subTitle1: "Test Subtitle 1",
        subTitle2: "Test Subtitle 2",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      };
      const newHeroResults = await request(app)
        .post("/heros")
        .set("Content-Type", "application/json")
        .send(newHero);
      const response = await request(app).delete(
        `/heros/${newHeroResults.body.id}`
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Hero deleted successfully.");
    });
    it("should return 404 status code if hero is not found", async () => {
      const response = await request(app).delete("/heros/999");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Hero not found.");
    });
    it("should return 403 status code if there is a validation error", async () => {
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
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Access denied");
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
