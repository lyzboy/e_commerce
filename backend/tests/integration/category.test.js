require("dotenv").config({ path: "../.env" });
// use supertest to mock the HTTP requests
const request = require("supertest");
// import the app for testing category-routes and category-controller without having to run the server
const app = require("../../app");
// import the category model so jest can mock the database functionality.
const categoryModel = require("../../models/category-model");

const jwt = require("jsonwebtoken");
// mock the category model to simulate access to the database
jest.mock("../../models/category-model");

describe("GET /api/v1/categories - Get Categories", () => {
    let req, res, next;
    // set jest beforeEach hook for pre test setup
    beforeEach(() => {
        jest.resetAllMocks();
        req = { headers: {} }; //mock request object
        // mock response object
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        // mock next middleware function
        next = jest.fn();
    });

    it("should return status 401 when no auth token provided", async () => {
        const categories = [
            {
                id: "1",
                name: "Updated Category 1",
                description: "Updated description 1",
            },
            {
                id: "2",
                name: "Updated Category 2",
                description: "Updated description 2",
            },
        ];

        categoryModel.getCategories.mockResolvedValue(categories);

        const response = await request(app).get(`/api/v1/categories`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("No auth token");
    });
    it("should return status 403 when auth token is invalid", async () => {
        //ARRANGE
        const invalidToken = `Bearer ${jwt.sign(
            { id: 1, role: "admin" },
            "wrong-secret",
            { expiresIn: "1800s" }
        )}`;
        const categories = [
            {
                id: "1",
                name: "Updated Category 1",
                description: "Updated description 1",
            },
            {
                id: "2",
                name: "Updated Category 2",
                description: "Updated description 2",
            },
        ];
        categoryModel.getCategories.mockResolvedValue(categories);

        //ACT
        const response = await request(app)
            .get(`/api/v1/categories`)
            .set("Authorization", invalidToken);

        //ASSERT
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
            "Authentication error: invalid signature"
        );
    });

    it("should return a max of 25 category objects from the database", async () => {
        // mock the jwt
        const token = jwt.sign(
            { id: 1, role: "user" },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "1800s",
            }
        );

        const limit = 25;

        categoryModel.getCategories.mockResolvedValue(new Array(25).fill({}));

        // ACT: Call the API with the limit query
        const response = await request(app)
            .get(`/api/v1/categories`)
            .set("Authorization", `Bearer ${token}`)
            .query({ limit });

        // ASSERT
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(limit); // Expect response to contain only the limited amount
    });

    it("should return status 500 when a server error", async () => {
        // Arrange
        const token = jwt.sign(
            { id: 1, role: "user" },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "1800s",
            }
        );

        // Mock the model function to throw an error
        categoryModel.getCategories.mockRejectedValue(
            new Error("Server error")
        );

        // Act
        const response = await request(app)
            .get(`/api/v1/categories`)
            .set("Authorization", `Bearer ${token}`);

        // Assert
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server error");
    });
});

describe("PUT /api/v1/categories/:id - Update Category", () => {
    // mock the jwt token
    const token = jwt.sign({ id: 1, role: "admin" }, process.env.TOKEN_SECRET, {
        expiresIn: "1800s",
    });
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
            .send(updateData)
            .set("Authorization", `Bearer ${token}`);

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
