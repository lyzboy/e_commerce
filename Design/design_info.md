# E-Commerce Project Design Information

## Quick Links

[**Style Guide**](design_docs/style_guide.md) <br>
[**Scope Document**](design_docs/scope_document.md) X<br>
[**Component Planning**](design_docs/component_planning.md)  <br>
[**Redux Store Documentation**](design_docs/redux_store_documentation.md)  <br>
[**Testing Documentation**](design_docs/testing_documentation.md)<br>
[**Design Layout Brainstorm**](design_docs/design_layout_brainstorm.md) X<br>

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
    - Passport JWT (JWT authentication)
    - Bcrypt (password hashing)
    - Express-Validator (input validation)
    - Oauth2-server (OAuth2)
    - Express-session (session management)
    - Node-postgres (PostgreSQL client)
    - Express-session (session management)
- Mocha (testing)
- Chai (testing)

### Database
- PostgreSQL

### Hosting
- Render (Full-stack hosting)
- [Cloudinary](https://cloudinary.com/) (Image hosting)
- Supabase (PostgreSQL database hosting)
- Stripe (payment processing - test mode)
- SendGrid (email service - free tier)

## Security

For authentication for endpoints that require an elevated level of access (HTTP Methods: delete, put, etc.), the API will use JWT tokens. The token will be passed in the header of the request. The token will be verified using the `passport-jwt` strategy. The token will be signed using the `jsonwebtoken` package. This will ensure that the user is who they say they are and prevent against CSRF attacks. There will be two levels of access: user and admin. The admin level will have access to all endpoints, while the user level will have access to only certain endpoints. The server will check the token against the database to ensure the all HTTP Methods come from an admin account when the bearer token is present.

## Database Schema

The schema can be found at [dbdiagram.io](https://dbdiagram.io/d/E-Commerce-Codecademy-66b97b108b4bb5230ed3f102)

The current schema is pictured below:

![database schema](/Design/design_docs/imgs/DB_Schema.png)

## API Documentation

The API documentation has been created using Swagger Editor. The file [ecommerce-swagger.yaml](ecommerce-swagger.yaml) can be uploaded to the Swagger editor either [online](https://editor.swagger.io/) or desktop to view the documentation.

> **Note**:<br>
> new endpoints need to be added for:
> - user registration
> - password reset

## Wireframes and Mockups
