// use supertest to mock the HTTP requests
const request = require("supertest");
// import the app for testing category-routes and category-controller without having to run the server
const app = require("../../src/app");
// import the category model so jest can mock the database functionality.
const categoryModel = require("../../src/models/category");

// mock the category model to simulate access to the database
jest.mock("../../../models/category-model");

describe("PUT /api/v1/categories/:id - Update Category", () => {
    // make test use async since category model is async
    it("should update a category and return the updated category", async () => {
        // Arrange
        // Act
        // Assert
    });
});
