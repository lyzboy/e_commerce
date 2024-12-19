# E-Commerce Project Design Information

## Quick Links

[**Style Guide**](design_docs/style_guide.md) <br>
[**Scope Document**](design_docs/scope_document.md) X<br>
[**Component Planning**](design_docs/component_planning.md)  <br>
[**Redux Store Documentation**](design_docs/redux_store_documentation.md)  <br>
[**Testing Documentation**](design_docs/testing_documentation.md)<br>
[**Design Layout Brainstorm**](design_docs/design_layout_brainstorm.md) X<br>
[**Database Table Guide**](design_docs/db_table_guide.md)<br>

## Table of Contents

[**Technology Stack**](#technology-stack)<br>
[**Database Schema**](#database-schema)<br>
[**API Documentation**](#api-documentation)<br>
[**Wireframes and Mockups**](#wireframes-and-mockups)<br>

---

## Technology Stack

### Frontend
- React (CRA)
- Redux (state management)
- RTL (react testing)
- Jest (js testing)

### Backend
- Node.js
- Express
    - Passport (authentication)
    - Bcrypt (password hashing)
    - Express-Validator (input validation)
    - Oauth2-server (OAuth2)
    - Express-session (session management)
    - Node-postgres (PostgreSQL client)
    - Express-session (session management)
- Jest (js testing)
- Supertest (API testing)

### Database
- PostgreSQL

### Hosting
- Render (Full-stack hosting)
- [Cloudinary](https://cloudinary.com/) (Image hosting)
<!-- - Supabase (PostgreSQL database hosting) -->
- Stripe (payment processing - test mode)
- SendGrid (email service - free tier)

## Legal Documents

This website should include documents. It may be beneficial to include an editor for admin to edit these documents. The documents should include:

- Privacy Policy (with cookie policy)
- Terms of Service
- Refund Policy

## Security

<!-- For authentication for endpoints that require an elevated level of access (HTTP Methods: delete, put, etc.), the API will use JWT tokens. The token will be passed in the header of the request. The token will be verified using the `passport-jwt` strategy. The token will be signed using the `jsonwebtoken` package. This will ensure that the user is who they say they are and prevent against CSRF attacks. There will be two levels of access: user and admin. The admin level will have access to all endpoints, while the user level will have access to only certain endpoints. The server will check the token against the database to ensure the all HTTP Methods come from an admin account when the bearer token is present. The token payload will need to contain a role field that is either 'user' or 'admin. -->

Each endpoint will require an authenticated account for access. Elevate access will require an admin account. The application will utilize passport local to authenticate users. Authorization to elevated user's will be done by checks the passport session object for the `role` field. The role field will be either 'user' or 'admin'. The server will also query the database to ensure that the user's email is present in the admin table.



## Database Schema

The schema can be found at [dbdiagram.io](https://dbdiagram.io/d/E-Commerce-Codecademy-66b97b108b4bb5230ed3f102)

The current schema is pictured below:

![database schema](/Design/design_docs/imgs/DB_Schema.png)

## API Documentation

The API documentation has been created using Swagger Editor. The file [ecommerce-swagger.yaml](ecommerce-swagger.yaml) can be uploaded to the Swagger editor either [online](https://editor.swagger.io/) or desktop to view the documentation.

### Needed Functions
- Get user profile
    - username
    - email
    - address
    - phone number
- Update user profile
- Delete user
- Get all products
- Get product by id
- Update product
- Delete product
- Create product
- Get all orders
- Get order by id
- Update order
- Delete order
- Create order
- Get all categories
- Get category by id
- Update category
- Delete category
- Create category

## Wireframes and Mockups
