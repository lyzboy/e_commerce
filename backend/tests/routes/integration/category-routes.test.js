const request = require('supertest'); // Import supertest for making HTTP requests
const app = require('../../../app'); // Import the Express app
const queries = require('../../../models/category-model'); // Import the queries from the category model

jest.mock('../../../models/category-model'); // Mock the category model to control its behavior in tests

describe('Category Routes', () => {
  // Test for GET /api/v1/categories
  describe('GET /api/v1/categories', () => {
    it('should return a list of categories', async () => {
      const mockCategories = [{ id: 1, name: 'Electronics' }, { id: 2, name: 'Books' }]; // Mock data
      
      queries.getCategories.mockResolvedValue(mockCategories); // Mock the getCategories function to return mock data

      const response = await request(app).get('/api/v1/categories'); // Make a GET request to the endpoint

      expect(response.status).toBe(200); // Expect the status code to be 200
      expect(response.body).toEqual(mockCategories); // Expect the response body to match the mock data
    });

    it('should handle server errors', async () => {
      queries.getCategories.mockRejectedValue(new Error('Database error')); // Mock the getCategories function to throw an error

      const response = await request(app).get('/api/v1/categories'); // Make a GET request to the endpoint

      expect(response.status).toBe(500); // Expect the status code to be 500
      expect(response.body).toEqual({ message: 'Server error:Database error' }); // Expect the response body to contain the error message
    });
  });

  // Test for POST /api/v1/categories
  describe('POST /api/v1/categories', () => {
    it('should create a new category', async () => {
      const newCategory = { name: 'Clothing' }; // Mock data for the new category
      const createdCategory = { id: 3, name: 'Clothing' }; // Mock data for the created category
      queries.createCategory.mockResolvedValue(createdCategory); // Mock the createCategory function to return the created category

      const response = await request(app).post('/api/v1/categories').send(newCategory); // Make a POST request to the endpoint with the new category data

      expect(response.status).toBe(200); // Expect the status code to be 200
      expect(response.body).toEqual(createdCategory); // Expect the response body to match the created category data
    });

    it('should handle server errors', async () => {
      queries.createCategory.mockRejectedValue(new Error('Database error')); // Mock the createCategory function to throw an error

      const response = await request(app).post('/api/v1/categories').send({ name: 'Clothing' }); // Make a POST request to the endpoint with some data

      expect(response.status).toBe(500); // Expect the status code to be 500
      expect(response.body).toEqual({ message: 'Server Error:Database error' }); // Expect the response body to contain the error message
    });
  });
});