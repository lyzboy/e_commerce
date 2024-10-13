// Import the supertest library for making HTTP requests in tests
const request = require("supertest");

// Import the Express app from the app.js file
const app = require("./app"); // Assuming app.js exports the Express app

// Import the database queries module
const db = require("./db/queries"); // Adjust the path to match your folder structure

// Mock the database module using Jest
jest.mock("./db/queries");

// Define a test suite for the POST /api/v1/categories endpoint
describe("POST /api/v1/categories", () => {
    // Define a test case for creating a new category
    it("should create a new category", async () => {
        // Define the new category data to be sent in the request
        const newCategory = {
            name: "Electronics",
            description: "A collection of electronics",
        };

        // Mock the db.createCategory function to return a new category
        db.createCategory.mockResolvedValue({
            id: 1,
            ...newCategory,
        });

        // Make a POST request to the /api/v1/categories endpoint with the new category data
        const response = await request(app)
            .post("/api/v1/categories")
            .send(newCategory);

        // Assert that the response status is 200 (OK)
        expect(response.status).toBe(200);

        // Assert that the response body contains the expected properties and values
        expect(response.body).toHaveProperty("id", 1);
        expect(response.body.name).toBe(newCategory.name);
        expect(response.body.description).toBe(newCategory.description);
    });

    // Define a test case for handling server errors
    it("should return 500 if there is a server error", async () => {
        // Define the new category data to be sent in the request
        const newCategory = { name: "Electronics" };

        // Mock the db.createCategory function to throw an error
        db.createCategory.mockRejectedValue(new Error("Server Error"));

        // Make a POST request to the /api/v1/categories endpoint with the new category data
        const response = await request(app)
            .post("/api/v1/categories")
            .send(newCategory);

        // Assert that the response status is 500 (Internal Server Error)
        expect(response.status).toBe(500);

        // Assert that the response body contains the expected error message
        expect(response.body).toHaveProperty(
            "message",
            "Server Error:Server Error"
        );
    });
});
