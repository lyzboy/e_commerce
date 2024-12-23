[ &#127968; Return To Design Info](../design_info.md)

# Style Guide

## Naming Conventions

### Variables and Functions

- **Camel Case:** Use camelCase for variable and function names.
  ```javascript
  let userName = 'John';
  function getUserName() { ... }
  ```

### Classes and Components

- **Pascal Case:** Use PascalCase for class and component names.
  ```javascript
  class UserProfile { ... }
  ```

### Files and Folders

- **Kebab Case:** Use kebab-case for file and folder names.
  ```plaintext
  user-profile.js
  ```

## Database Entity Creation

### Table Names

- **Plural Form:** Use plural form for table names.
  ```sql
  CREATE TABLE users ( ... );
  ```

### Column Names

- **Snake Case:** Use snake_case for column names.
  ```sql
  user_id INT PRIMARY KEY;
  ```

## Case Style

### JavaScript

- **Camel Case:** Use camelCase for variables and functions.
- **Pascal Case:** Use PascalCase for classes and components.

### SQL

- **Snake Case:** Use snake_case for table and column names.

## Code Structure

### Project Structure

- **Organize by Feature:** Group files by feature or module.
  ```plaintext
  /src
    /components
    /services
    /models
  ```

### Imports

- **Absolute Imports:** Use absolute imports for modules.
  ```javascript
  import UserService from 'services/UserService';
  ```

## Best Practices

### Code Comments

- **JSDoc:** Use JSDoc for function and class documentation.
  ```javascript
  /**
   * Gets the user name.
   * @param {number} userId - The ID of the user.
   * @returns {string} The user name.
   */
  function getUserName(userId) { ... }
  ```

### Error Handling

- **Try-Catch:** Use try-catch for error handling.
  ```javascript
  try {
    // code
  } catch (error) {
    console.error(error);
  }
  ```

### Consistent Formatting

- **Prettier:** Use Prettier for consistent code formatting.
  ```plaintext
  prettier --write .
  ```

## Version Control

### Git

- **Branch Naming:** Use descriptive names for branches with an underscore between branch type and description.
  ```plaintext
  feature_user-authentication
  ```

- **Commit Messages:** Use clear and concise commit messages.
  ```plaintext
  Add user authentication feature
  ```

## Testing

### Unit Tests

- **Jest:** Use Jest for unit testing.
  ```javascript
  test('should return user name', () => {
    expect(getUserName(1)).toBe('John');
  });
  ```

### Integration Tests

- **Supertest:** Use Supertest for integration testing.
  ```javascript
  const request = require('supertest');
  const app = require('../app');

  test('GET /users', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
  });
  ```

## Documentation

### README

- **Project Overview:** Provide a brief overview of the project.
- **Installation:** Include installation instructions.
- **Usage:** Provide usage examples.
- **Contributing:** Outline contribution guidelines.

### API Documentation

- **Swagger:** Use Swagger for API documentation.
  ```yaml
  openapi: 3.0.0
  info:
    title: E-commerce API
    version: 1.0.0
  paths:
    /users:
      get:
        summary: Get all users
        responses:
          '200':
            description: A list of users
  ```
