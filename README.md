
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

If you would like to make calls to the API from a client like Postman, ensure that your environment variable `DEV_MODE` is set to true. You will then need to ensure that in the request body for your calls, that you include the field `"dev"` with the value `"true"`.

```js
{
  "dev": "true",
}
```
By doing so, your token payload will use the following properties:
```js
{
  "username": "dev",
  "role": "admin"
}
```
---

## Features

TBD

---

## Roadmap

- Add your upcoming features and plans here (you can create checklists for progress).
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
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add feature details"
   ```
4. **Push to your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

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