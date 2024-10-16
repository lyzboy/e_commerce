// Import the getCategories and createCategory functions from the category-model file
const { getCategories, createCategory } = require('../../../models/category-model');

// Import the query function from the db configuration file
const { query } = require('../../../config/db');

// Mock the db configuration file to control its behavior in tests
jest.mock('../../../config/db');

// Describe the test suite for the Category Model
describe('Category Model', () => {
  // Clear all mocks after each test to ensure no test affects another
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Describe the test suite for the getCategories function
  describe('getCategories', () => {
    // Test case: should retrieve all categories from the database
    it('should retrieve all categories from the database', async () => {
      // Mock data to be returned by the query function
      const mockCategories = [
        { id: 1, name: 'Electronics', description: 'Electronic items' },
        { id: 2, name: 'Books', description: 'Books and literature' },
      ];

      // Mock the resolved value of the query function to return the mock data
      query.mockResolvedValue({ rows: mockCategories });

      // Call the getCategories function
      const categories = await getCategories();

      // Assert that the query function was called with the correct SQL statement
      expect(query).toHaveBeenCalledWith("SELECT * FROM categories ORDER BY name ASC");
      // Assert that the returned categories match the mock data
      expect(categories).toEqual(mockCategories);
    });

    // Test case: should return an empty array if no categories are found
    it('should return an empty array if no categories are found', async () => {
      // Mock the resolved value of the query function to return an empty array
      query.mockResolvedValue({ rows: [] });

      // Call the getCategories function
      const categories = await getCategories();

      // Assert that the query function was called with the correct SQL statement
      expect(query).toHaveBeenCalledWith("SELECT * FROM categories ORDER BY name ASC");
      // Assert that the returned categories are an empty array
      expect(categories).toEqual([]);
    });
  });

  // Describe the test suite for the createCategory function
  describe('createCategory', () => {
    // Test case: should create a new category and return it
    it('should create a new category and return it', async () => {
      // Mock data to be returned by the query function
      const mockCategory = { id: 1, name: 'Toys', description: 'Children toys' };

      // Mock the resolved value of the query function to return the mock data
      query.mockResolvedValue({ rows: [mockCategory] });

      // Call the createCategory function with the name and description of the new category
      const category = await createCategory('Toys', 'Children toys');

      // Assert that the query function was called with the correct SQL statement and parameters
      expect(query).toHaveBeenCalledWith(
        "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
        ['Toys', 'Children toys']
      );
      // Assert that the returned category matches the mock data
      expect(category).toEqual(mockCategory);
    });

    // Test case: should throw an error if category creation fails
    it('should throw an error if category creation fails', async () => {
      // Mock the rejected value of the query function to throw an error
      query.mockRejectedValue(new Error('Database error'));

      // Assert that the createCategory function throws an error when called
      await expect(createCategory('Toys', 'Children toys')).rejects.toThrow('Database error');
    });
  });
});