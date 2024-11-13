
# Project Title

**E-Commerce Web App**  
This project aims to create a modern eCommerce platform that offers seamless integration with payment processors. It can be used by small businesses to sell products online or adapted for larger enterprises.

[![License](https://img.shields.io/github/license/lyzboy/e_commerce.svg)](LICENSE)
[![Build Status](https://img.shields.io/github/workflow/status/lyzboy/e_commerce/CI)](https://github.com/lyzboy/e_commerce/actions)
[![Repo Size](https://img.shields.io/github/repo-size/lyzboy/e_commerce.svg)](https://github.com/lyzboy/e_commerce)
[![Contributors](https://img.shields.io/github/contributors/lyzboy/e_commerce.svg)](https://github.com/lyzboy/e_commerce/graphs/contributors)

---

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About

This project is a web application that allows users to browse products, add them to a cart, and purchase them online. It includes features such as user authentication, product management, and payment processing. The app is built using modern web technologies and follows best practices for security and performance.

The web app includes an admin dashboard where store owners can manage products, view orders, and update inventory. It also provides an API for developers to integrate the platform with other services. The app is designed to be responsive and accessible, making it easy to use on any device.

---

## Installation

### Prerequisites

- Node.js
- PostgreSQL

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lyzboy/e_commerce.git
   ```
2. **Install dependencies**:
    There is a frontend and backend folder. You need to install dependencies for both.
    a). Backend
    ```bash
    cd backend
    npm install
    ```
    b). Frontend (ensure that you have return to the root directory)
    ```bash
    cd frontend
    npm install
    ```

3. **Set up environment variables**:
   Copy the `.env.example` file and configure the following environment variables:
   ```bash
   cp .env.example .env
   ```
   - `TOKEN_SECRET`
      - Use `/backend/util/secretGenerator.js` if you would like to generate a random secret. Using:
      ```bash
      node backend/util/secretGenerator.js
      ```
      It will output a random string in the console that you can copy and paste in the `TOKEN_SECRET` field within .env
   - `POOL_USER_NAME`
   - etc.
4. **Set up the database**:
   Create a new database in PostgreSQL and run the SQL script create_ecommerceDB.sql. This will create the database with the necessary tables and roles.
   ```bash
   psql -U postgres -f create_ecommerceDB.sql
   ```
5. **Run the project**:

You will need to run the backend and frontend separately.

a.) Backend
```bash
cd backend
npm run dev
```
b.) Frontend
```bash
cd frontend
npm run dev
```

---

## Usage

- How to interact with the project, run tests, and any other necessary usage instructions.  
Example:  
```bash
npm run dev
```

You can access the app by visiting `http://localhost:3000` in your browser.

### Calling the API

In order to do call any endpoints, you will need to create an account using the endpoint `/api/v1/user/register` with the required fields in the request body:

```json
{
   "email":"your_email",
   "username":"your_username",
   "password":"password_8_long_1_number_1_symbol_minimum"
}
```

Once this user has been created within your database, the user will automatically be authenticated and you can start making calls to standard user endpoints. After the user is in the database, you will only need, instead of registering again, to authenticate using, `/api/v1/user/login` by providing the username and password in the request body:
   
   ```json
   {
      "username":"your_username",
      "password":"password_8_long_1_number_1_symbol_minimum"
   }
   ```

### Protected Routes

Once you are authenticated, you will be able to access the API's endpoints. Certain routes are protected by login only and others by admin login. In order for you to access the admin login routes, the user you login in with must be in the admins table in the database. Currently there are no API calls that will allow you to add an admin to the admins table. You will need to manually add the user to the admins table in the database.

```postgresql
INSERT INTO admins (account_email) VALUES ('the_email_of_the_user');
```

Once the user is in the admins table, you will be able to access the admin routes once authenticated using `/api/v1/user/login`.

Certain routes are protected and only accessible by the user who owns the data. For example, you can only access a user's cart if you are logged in as that user. You can only access a user's order if you are logged in as that user. With this said, an admin account currently can access all data, even if the data is ownership protected. To find out more about authorization, please refer to the authorization file `/backend/middleware/authorization.js`.

---

## Features

TBD

---

## Roadmap

- Upcoming Features and Plans 
  - [X] Add user authentication
   - [ ] Implement product management
   - [ ] Create shopping cart functionality
   - [ ] Implement order processing
   - [ ] Add API for developers
   - [ ] Admin panel
   - [ ] Dynamic hero creation within admin panel
   - [ ] Frontend
  - [ ] Initial release
  - [ ] Add payment gateway
  - [ ] Create admin dashboard

---

## Contributing

Contributions are always welcome!  
Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on the process of submitting pull requests.

### How to Contribute

1. **Fork the repository**
2. **Create a branch for your feature**:
   ```bash
   git checkout -b feature_your-feature-name
   ```
   Please be sure to preface your branch with a relating term like `feature`, `bug`, `requirement`, etc.

   For example, if you are fixing a bug, you would create a branch like so:

   ```bash
   git checkout -b bug_your-feature-name
   ```
   If your branch is for a requirement from the design document, you would create a branch like so:

   ```bash
   git checkout -b requirement_your-feature-name
   ```

   Ensure that you feature name is concise and descriptive of the feature you are adding. For example, if you are adding a feature that allows users to add items to their cart, you would name your branch `feature_add-to-cart`.

3. **Commit your changes**:
   ```bash
   git commit -m "Add feature details"
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**
   Once you have pushed your changes to your branch and are finished with your feature, you can open a pull request to the main repository. Be sure to include a detailed description of your changes and any relevant information that would be helpful for the reviewer. Please use the appropriate template for your pull request. A reviewer will review your changes and provide feedback.

---

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## Contact

**Josh Sanford**<br>
Project Link: [E-commerce](https://github.com/lyzboy/e_commerce)

---

## Acknowledgements

  - Inspiration: [Codecademy](https://codecademy.com/)
  - Framework: [React](https://reactjs.org/)
