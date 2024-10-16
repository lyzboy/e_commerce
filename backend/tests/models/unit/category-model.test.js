// Import the functions we want to test from the category-model file
const { getCategories, createCategory } = require('../../../models/category-model');

// Import the query function from the db configuration file
const { query } = require('../../../config/db');

// Mock the db configuration file so we can control its behavior in the unit test
jest.mock('../../../config/db');

// Describe the overall test suite for the Category Model
describe('Category Model - Unit Tests', () => {

  // This hook runs after each test to ensure that mocks are cleared and 
  // tests are isolated (each test starts with a fresh mock).
  afterEach(() => {
    jest.clearAllMocks(); // Clears mock call history, ensuring no test affects another
  });

  // Testing the `getCategories` function
  describe('getCategories', () => {

    // Test case: it should retrieve all categories from the database
    it('should retrieve all categories from the database', async () => {

      // Define some mock data that represents what would be returned from the database
      const mockCategories = [
        { id: 1, name: 'Electronics', description: 'Electronic items' },
        { id: 2, name: 'Books', description: 'Books and literature' },
      ];

      // Mock the `query` function to resolve (return a value) with the mock data
      query.mockResolvedValue({ rows: mockCategories });

      // Call the actual `getCategories` function
      const categories = await getCategories();

      // Ensure that the `query` function was called with the correct SQL query
      expect(query).toHaveBeenCalledWith("SELECT * FROM categories ORDER BY name ASC");

      // Ensure that the returned categories are exactly the same as the mock data
      expect(categories).toEqual(mockCategories);
    });

    // Test case: it should return an empty array if no categories are found
    it('should return an empty array if no categories are found', async () => {

      // Mock the `query` function to return an empty array (no categories found)
      query.mockResolvedValue({ rows: [] });

      // Call the `getCategories` function
      const categories = await getCategories();

      // Ensure that the `query` function was called with the same SQL query
      expect(query).toHaveBeenCalledWith("SELECT * FROM categories ORDER BY name ASC");

      // Ensure that an empty array is returned
      expect(categories).toEqual([]);
    });
  });

  // Testing the `createCategory` function
  describe('createCategory', () => {

    // Test case: it should create a new category and return the newly created category
    it('should create a new category and return it', async () => {

      // Define mock data representing the newly created category returned from the database
      const mockCategory = { id: 3, name: 'Toys', description: 'Children toys' };

      // Mock the `query` function to return the newly created category
      query.mockResolvedValue({ rows: [mockCategory] });

      // Call the `createCategory` function with mock inputs (name and description)
      const category = await createCategory('Toys', 'Children toys');

      // Ensure the `query` function was called with the correct SQL and parameters
      expect(query).toHaveBeenCalledWith(
        "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
        ['Toys', 'Children toys']
      );

      // Ensure that the returned category matches the mock data
      expect(category).toEqual(mockCategory);
    });

    // Test case: it should throw an error if category creation fails
    it('should throw an error if category creation fails', async () => {

      // Mock the `query` function to throw an error (simulate a database failure)
      query.mockRejectedValue(new Error('Database error'));

      // Assert that calling `createCategory` throws the correct error
      await expect(createCategory('Toys', 'Children toys')).rejects.toThrow('Database error');
    });
  });
});
