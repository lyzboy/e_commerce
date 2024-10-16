// UNIT TEST

const httpMocks = require("node-mocks-http"); // Library for mocking req and res
const categoryRoutes = require("../../../routes/category-routes"); // Import the routes
const queries = require("../../../models/category-model"); // Import the model to mock

jest.mock("../../../models/category-model"); // Mock the category-model

describe("Category Routes - Unit Tests", () => {
    // Test the GET / route
    describe("GET /api/v1/categories", () => {
        it("should return a list of categories with status 200", async () => {
            // *** Arrange ***
            const mockCategories = [
                { id: 1, name: "Name1", description: "Description1" },
                { id: 2, name: "Name2", description: "Description2" },
            ];
            // Mock the model function to return mock categories, this will be what is
            // returned from the _getJSONData() function
            queries.getCategories.mockResolvedValue(mockCategories);
            const req = httpMocks.createRequest({ method: "GET" }); // Create a mock request object
            const res = httpMocks.createResponse(); // Create a mock response object

            // *** Act ***
            await categoryRoutes.handle(req, res); // Call the route handler directly

            // *** Assert ***
            expect(res.statusCode).toBe(200); // Assert the status code
            expect(res._getJSONData()).toEqual(mockCategories); // Assert the response body (use _getJSONData for json response)
        });

        it("should handle errors with status 500", async () => {
            // *** Arrange ***
            queries.getCategories.mockRejectedValue(
                new Error("Database error")
            ); // Mock the model to throw an error
            const req = httpMocks.createRequest({ method: "GET" });
            const res = httpMocks.createResponse();

            // *** Act ***
            await categoryRoutes.handle(req, res);

            // *** Assert ***
            expect(res.statusCode).toBe(500); // Assert the status code
            expect(res._getJSONData()).toEqual({
                message: "Server error: Database error",
            }); // Assert the error message
        });
    });

    // Test the POST / route
    describe("POST /api/v1/categories", () => {
        it("should create a category and return it with status 200", async () => {
            // *** Arrange ***
            const newCategory = {
                name: "Clothing",
                description: "Items relating to clothing",
            };
            const createdCategory = { id: 3, ...newCategory };
            queries.createCategory.mockResolvedValue(createdCategory); // Mock the model function
            const req = httpMocks.createRequest({
                method: "POST",
                body: newCategory,
            }); // Mock request with body
            const res = httpMocks.createResponse();

            // *** Act ***
            await categoryRoutes.handle(req, res);

            // *** Assert ***
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(createdCategory);
        });

        it("should handle errors with status 500", async () => {
            // *** Arrange ***
            queries.createCategory.mockRejectedValue(
                new Error("Database error")
            ); // Mock the model to throw an error
            const req = httpMocks.createRequest({
                method: "POST",
                body: { name: "Clothing" },
            });
            const res = httpMocks.createResponse();

            // *** Act ***
            await categoryRoutes.handle(req, res);

            // *** Assert ***
            expect(res.statusCode).toBe(500);
            expect(res._getJSONData()).toEqual({
                message: "Server Error: Database error",
            });
        });
    });

    describe("DELETE /api/v1/categories/:id", () => {
        it("should delete a category and return a 200 success status", async () => {
            queries.deleteCategory.mockResolvedValue(1);
            const response = await request(app).delete("/api/v1/categories/1");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Category deleted successfully",
            });
        });
    });
});
