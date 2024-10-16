const request = require('supertest'); // Import supertest for making HTTP requests to the Express app
const app = require('../../../app'); // Import the Express app (which you will test)
const queries = require('../../../models/category-model'); // Import the model (queries) for mocking

jest.mock('../../../models/category-model'); // Mock the entire category model to control its behavior in tests

// Describe the entire test suite for the Category Routes
describe('Category Routes', () => {

  // Testing the GET /api/v1/categories route
  describe('GET /api/v1/categories', () => {

    // Test case: Should return a list of categories successfully (status 200)
    it('should return a list of categories', async () => {
      // Mock data that will be returned when querying the database
      const mockCategories = [{ id: 1, name: 'Electronics' }, { id: 2, name: 'Books' }];

      // Mock the getCategories function from the category-model to return mockCategories
      queries.getCategories.mockResolvedValue(mockCategories); 

      // Send a GET request to the /api/v1/categories route
      const response = await request(app).get('/api/v1/categories');

      // Expect that the response status is 200 (OK)
      expect(response.status).toBe(200);

      // Expect that the body of the response matches the mock data we defined earlier
      expect(response.body).toEqual(mockCategories);
    });

    // Test case: Should handle server errors by returning a 500 status
    it('should handle server errors', async () => {
      // Mock the getCategories function to throw an error, simulating a server/database issue
      queries.getCategories.mockRejectedValue(new Error('Database error'));

      // Send a GET request to the /api/v1/categories route
      const response = await request(app).get('/api/v1/categories');

      // Expect that the response status is 500 (Internal Server Error)
      expect(response.status).toBe(500);

      // Expect that the response body contains the correct error message
      expect(response.body).toEqual({ message: 'Server error:Database error' });
    });
  });

  // Testing the POST /api/v1/categories route
  describe('POST /api/v1/categories', () => {

    // Test case: Should create a new category successfully (status 200)
    it('should create a new category', async () => {
      // Mock data for the new category that will be sent to the route
      const newCategory = { name: 'Clothing' };

      // Mock data for the created category, returned after inserting it into the database
      const createdCategory = { id: 3, name: 'Clothing' };

      // Mock the createCategory function from the category-model to return the created category
      queries.createCategory.mockResolvedValue(createdCategory);

      // Send a POST request to the /api/v1/categories route, with the new category data
      const response = await request(app).post('/api/v1/categories').send(newCategory);

      // Expect that the response status is 200 (OK)
      expect(response.status).toBe(200);

      // Expect that the body of the response matches the created category data
      expect(response.body).toEqual(createdCategory);
    });

    // Test case: Should handle server errors by returning a 500 status
    it('should handle server errors', async () => {
      // Mock the createCategory function to throw an error, simulating a server/database issue
      queries.createCategory.mockRejectedValue(new Error('Database error'));

      // Send a POST request to the /api/v1/categories route, with some data
      const response = await request(app).post('/api/v1/categories').send({ name: 'Clothing' });

      // Expect that the response status is 500 (Internal Server Error)
      expect(response.status).toBe(500);

      // Expect that the body of the response contains the correct error message
      expect(response.body).toEqual({ message: 'Server Error:Database error' });
    });
  });
});
