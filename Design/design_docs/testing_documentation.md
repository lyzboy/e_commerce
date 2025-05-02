[ &#127968; Return To Design Info](../design_info.md)

# Testing Document for E-commerce Portfolio Project

## Table of Contents
1. [Introduction](#1-introduction)
2. [Test Strategy](#2-test-strategy)
3. [Frontend Section](#3-frontend-section)
4. [Backend Section](#4-backend-section)
5. [Performance Testing](#5-performance-testing)
6. [Test Cases](#6-test-cases)
7. [Test Tools](#7-test-tools)
8. [Test Environment](#8-test-environment)
9. [Test Schedule](#9-test-schedule)
10. [Conclusion](#10-conclusion)

## 1. Introduction
### **Project Overview**:
The e-commerce project is a full-stack web application that allows users to browse products, add them to a cart, and complete purchases. The frontend is built with React and Redux, while the backend uses Node.js and Express with a PostgreSQL database. Testing is primarily handled using Jest and Supertest for backend integration tests. The project integrates with third-party services like Stripe for payment processing and SendGrid for email notifications.

This document outlines the testing strategy, test cases, and tools used to ensure the quality and reliability of the e-commerce application.
### **Scope of Testing**:
Testing covers frontend components and user flows, backend API endpoints, database interactions, and authentication/authorization mechanisms. Third-party API integrations are tested where feasible, potentially using mocks.
### **Objectives**:
Ensure core functionalities (user registration, login, product browsing, cart management, checkout) work correctly. Verify API endpoints behave as expected under various conditions. Validate data integrity in the database. Confirm security measures like password hashing and authorization are effective. Assess basic performance and responsiveness.

## 2. Test Strategy
### **Testing Levels**:
- **Unit Testing**: Focused on individual functions or components (primarily frontend with Jest/React Testing Library, backend models/utilities with Jest).
- **Integration Testing**: Focused on the interaction between backend components, particularly API endpoints and database operations. This is heavily utilized in the backend using Jest and Supertest against a seeded test database.
- **System Testing**: End-to-end testing of user flows through the entire application (manual or potentially using E2E tools later).
- **Acceptance Testing**: Validating that the application meets user requirements (manual).
### **Testing Types**:
- **Functional Testing**: Validating user flows and API endpoint behavior (e.g., CRUD operations, authentication). This is the primary focus of the backend integration tests.
- **Non-functional Testing**: Basic checks for performance (response times) and security (password handling, authorization checks).
- **Database Seeding**: A dedicated seeding mechanism (`/backend/tests/db_seeding/dbSeed.js`) is used to populate the test database (`ecommerce_test.sql`) with consistent data before integration tests run, ensuring predictable test outcomes. Cleanup scripts are used afterwards.

## 3. Frontend Section
### **User Interface Tests**:
  - Check layout consistency across devices.
  - Validate forms (e.g., login, registration, address).
  - Test for responsiveness and accessibility.
### **Functional Tests**:
  - Navigation: Test routes for correctness (e.g., React Router).
  - Component Testing: Ensure each component renders and functions as expected (using Jest, React Testing Library).
### **User Interaction Tests**:
  - User registration and login flows.
  - Adding/removing items from the cart.
  - Checkout process simulation (up to payment gateway interaction).
  - Search and filter functionalities.

## 4. Backend Section
### **API Tests (Integration)**:
  - Test CRUD operations on key resources (users, products, categories, discounts, carts, orders, admins, heros) using **Supertest** to hit Express API endpoints.
  - Test authentication (login, registration, password recovery via `reset_password_codes`) and authorization (admin roles, user-specific data access) using mocked middleware and verifying endpoint responses/status codes.
  - Validate request data and test error handling for invalid inputs (4xx status codes).
  - Test query parameters for filtering and pagination (e.g., `/discounts?limit=1`).
### **Database Tests**:
  - Ensure correct data persistence and retrieval through API integration tests interacting with the seeded **PostgreSQL** test database.
  - Verify foreign key relationships and constraints implicitly via successful/failed operations.
  - Test error handling for database-related issues (e.g., duplicate entries resulting in 409).
### **Security Tests**:
  - Verify password hashing using `bcrypt` (via `authentication.js`) during user registration and login tests.
  - Test role-based access control by attempting actions with incorrect user roles (expecting 403 Forbidden).
  - Test password recovery code generation, verification, and expiration.

## 5. Performance Testing
### **Frontend**:
Test page load times and responsiveness using browser developer tools or dedicated tools (e.g., Lighthouse).
### **Backend**:
Monitor API response times during integration tests as a basic check. More rigorous load testing could be added later using tools like k6 or JMeter.

## 6. Test Cases
List all test cases, detailing:
- **Test ID**: Unique identifier (e.g., `USER-AUTH-01`).
- **Test Description**: Brief description (e.g., "Verify successful user login with valid credentials").
- **Input Data**: Specific inputs (e.g., `email: test@example.com`, `password: validPassword`).
- **Expected Result**: Expected HTTP status and response body/structure (e.g., `Status 200, { token: '...' }`).
- **Actual Result**: Outcome of the test run.
- **Status**: Pass/Fail.

*(The existing table example is suitable)*

| Test ID | Test Description | Input Data | Expected Result | Actual Result | Status |
|---------|------------------|------------|-----------------|---------------|--------|
| T001    | User Registration | Valid email, username, password | User account created, Status 200/201 | User account created | Pass |
| T002    | User Login | Valid email, password | Status 200, returns auth token/session | Status 200, token received | Pass |
| T003    | Get Discounts (Admin) | Valid admin token | Status 200, returns array of discounts | Status 200, array received | Pass |
| T004    | Add Product Discount (Admin) | Valid admin token, productId, discountId | Status 200, returns link ID | Status 200, ID received | Pass |
| T005    | Password Recovery Request | Valid email | Status 200, code generated in DB | Status 200, code generated | Pass |
| T006    | Verify Recovery Code | Valid code | Status 200, { message: "verified" } | Status 200, verified | Pass |

## 7. Test Tools
- **Backend Testing Framework**: **Jest** (Test runner, assertions, mocking `jest.fn()`).
- **API Integration Testing**: **Supertest** (Making HTTP requests to the Express app).
- **Backend Framework**: **Node.js / Express**.
- **Database**: **PostgreSQL** (via `pg` library and custom `db.js` wrapper).
- **Database Seeding**: Custom scripts in `/backend/tests/db_seeding`.
- **Frontend Testing**: Jest, React Testing Library (Assumed based on common practices).
- **CI/CD**: (Specify if applicable, e.g., GitHub Actions).

## 8. Test Environment
- **Execution**: Tests are run in a Node.js environment, typically locally or within a CI pipeline.
- **Database**: A separate **PostgreSQL** test database (`ecommerce_test`) is used, configured via environment variables (`.env`) and managed by seeding/cleanup scripts. The schema is defined in `ecommerce_test.sql`.
- **Mocking**:
    - **Jest mocks** (`jest.fn()`) are used to simulate function behavior or errors, isolating units or testing specific error paths in integration tests.
    - **Middleware mocking** is used in Supertest setups to simulate authenticated users (`req.user = ...`) for testing protected routes.

## 9. Test Schedule
- Outline milestones and deadlines for completing various testing phases (e.g., Unit tests completed by Sprint X, Integration tests for Auth module by Date Y).

## 10. Conclusion
- Testing relies heavily on backend integration tests using Jest and Supertest against a seeded PostgreSQL database.
- Assumes frontend testing uses Jest and React Testing Library.
- Dependencies include Node.js, PostgreSQL, and relevant npm packages (Jest, Supertest, pg, Express).
