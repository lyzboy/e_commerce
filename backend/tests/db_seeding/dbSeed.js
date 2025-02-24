const db = require("../../config/db");
const authentication = require("../../middlewares/authentication");

const seedDiscounts = require("./seedDiscounts");
const seedCategories = require("./seedCategories");
const seedProducts = require("./seedProducts");
const seedProductDiscounts = require("./seedProductDiscounts");
const seedProductsCategories = require("./seedProductsCategories");
const seedUserAccounts = require("./seedUserAccounts");
const seedAdmins = require("./seedAdmins");
const seedStates = require("./seedStates");

const dbSeed = {
  testDiscountId: 1,
  testCategoryId: 1,
  testProductId: 1,
  testProductDiscountId: 1,

  testQuery: async function (query, params) {
    try {
      const result = await db.query(query, params, true);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  },

  seedAll: async function () {
    const testUserPassword = "Password1!";

    await seedUserAccounts([
      {
        email: "testUser99@email.com",
        username: "testUser",
        name: "Test User",
        password: authentication.createHashedPassword(testUserPassword),
      },
      {
        email: "admin@email.com",
        username: "adminTest",
        password: authentication.createHashedPassword(testUserPassword),
      },
    ]);

    await seedAdmins([
      {
        email: "admin@email.com",
      },
    ]);

    await seedStates();

    await seedDiscounts([
      {
        code: "DISCOUNT10",
        percent_off: 10,
        expire_date: "2022-12-31",
        amount_off: null,
        quantity: null,
      },
      {
        code: "DISCOUNT20",
        percent_off: 20,
        expire_date: "2022-12-31",
        amount_off: 10.55,
        quantity: 5,
      },
    ]);

    await seedProducts([
      {
        barcode: "123456789",
        name: "Test Product",
        description: "Test Description",
        stock_quantity: 10,
        price: 100.0,
      },
      {
        barcode: "987654321",
        name: "Test Product 2",
        description: "Test Description 2",
        stock_quantity: 20,
        price: 200.0,
      },
      {
        barcode: "987654568",
        name: "Test Product 3",
        description: "Test Description 3",
        stock_quantity: 5,
        price: 19.99,
      },
    ]);

    await seedCategories([
      { name: "Test Category", description: "Test Description" },
    ]);

    // Retrieve the IDs
    const discountResults = await db.query(
      `SELECT id FROM discounts ORDER BY code`
    );
    this.testDiscountId = discountResults.rows[0].id;
    const productResults = await db.query(
      `SELECT id FROM products ORDER BY barcode`
    );
    const productIds = productResults.rows.map((row) => row.id);
    this.testProductId = productIds[0];

    const categoryResults = await db.query(`SELECT * FROM categories`);

    const discountIds = discountResults.rows.map((row) => {
      return row.id;
    });

    this.testCategoryId = categoryResults.rows[0].id;

    await seedProductDiscounts([
      {
        product_id: productIds[0],
        discount_id: discountIds[0],
        product_variant_id: null,
      },
      {
        product_id: productIds[1],
        discount_id: discountIds[1],
        product_variant_id: null,
      },
    ]);
    const productDiscounts = await db.query("SELECT * FROM products_discounts");
    this.testProductDiscountId = productDiscounts.rows[0].id;

    await seedProductsCategories([
      { product_id: productIds[0], category_id: this.testCategoryId },
      { product_id: productIds[1], category_id: this.testCategoryId },
    ]);
  },

  cleanupDbSeed: async function () {
    try {
      //BUG: check recovery password table name
      await db.query(`
        DELETE FROM products_discounts;
        DELETE FROM products_categories;
        DELETE FROM discounts;
        DELETE FROM products;
        DELETE FROM reset_password_codes;
        DELETE FROM categories;
        DELETE FROM carts;
        DELETE FROM admins;
        DELETE FROM accounts; 
      `);
      await db.testPool.end();
      console.log("Cleaned up discounts and closed database pool.");
    } catch (error) {
      throw new Error(error);
    }
  },
  cleanupDbPasswordReset: async function () {
    try {
      await db.query(`
        DELETE FROM reset_password_codes;
      `);
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = dbSeed;
