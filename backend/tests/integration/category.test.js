// use supertest to mock the HTTP requests
const request = require("supertest");
// import the app for testing category-routes and category-controller without having to run the server
const app = require("../../app");
// import the category model so jest can mock the database functionality.
const categoryModel = require("../../models/category-model");

// mock the category model to simulate access to the database
jest.mock("../../models/category-model");

describe("PUT /api/v1/categories/:id - Update Category", () => {
    // make test use async since category model is async
    it("should update a category and return the updated category", async () => {
        // Arrange
        // mock category id
        const categoryId = "1";
        // mock what updated category should look like
        const updatedCategory = {
            id: categoryId,
            name: "Updated Category",
            description: "Updated description",
        };

        // Mock the model function that will be called in the controller. ResolvedValue is a success and the parameter is the object that would be returned.
        categoryModel.updateCategory.mockResolvedValue(updatedCategory);

        // create a mock request body for the update
        const updateData = {
            name: "Updated Category",
            description: "Updated description",
        };

        // Act
        // send the request using supertest to simulate the request
        const response = await request(app)
            // call the endpoint with the id as a template literal
            .put(`/api/v1/categories/${categoryId}`)
            // pass the update data in the request body to the server. This is the data that would be asked the original to be changed to.
            .send(updateData);

        // Assert
        // should have correct status
        expect(response.status).toBe(200);
        // response body should have the updated category
        expect(response.body).toEqual(updatedCategory);
        //ensure that the model was called with the correct object data
        expect(categoryModel.updateCategory).toHaveBeenCalledWith({
            id: categoryId,
            ...updateData,
        });
    });
});
