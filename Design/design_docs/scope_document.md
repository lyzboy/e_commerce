[ &#127968; Return To Design Info](../design_info.md)

# Scope Document

## Table Of Contents

-   [Project Overview](#project-overview)
-   [Objectives](#objectives)
-   [Features](#features)
    -   [Required Features](#required-features)
    -   [Optional Features](#optional-features)

---

## Project Overview

This project is a fully-functioning e-commerce web application that will allow users to register and account, browse products for sale, and complete a purchase.

## Objectives

The main objectives of the project will align with common e-commerce platforms. The project will allow users to complete the following actions. Some actions will be restricted to certain roles:

-   Register an account
-   Browse products
-   Add products to a cart
-   Complete a purchase
-   View past orders
-   Update account information
-   Log in and out
-   Reset a password
-   View product details
- Review orders
- Review users

## Features

The roles of different users will be as follows:

> ### Admins: <br>
> Refers administrators of the site. They will be able to view, edit, and delete products and orders.

> ### Users:<br> 
> Refers to logged in users of the site. They will be able to view products, add products to a cart, and complete a purchase. These are end-users.

> ### Visitors:<br> 
> refers to users who are not logged in but include the subset of logged in users. Any action a visitor can take, a logged in user can also take. These are end-users. 


### Required Features

-   **User Registration**
    - [ ] Visitors will be able to register an account with an email address and password.
    - [ ] Visitors will be able to log in using a 3rd party service (Google, Facebook, etc.)
    - [ ] Visitors will be able to reset their password.
    - [ ] Visitors will be able to update their account information including address and payment information.
-  **Product Browsing**
    - [ ] Visitors will be able to view a list of products.
    - [ ] Visitors will be able to view a single product.
    - [ ] Visitors will be able to search for products.
    - [ ] Visitors will be able to filter products by category.
-   **Cart**
    - [ ] Users will be able to add items to their cart.
    - [ ] Users will be able to remove items from their cart.
-   **Product Management**
    - [ ] Admins will be able to view products.
    - [ ] Admins will be able to edit products.
    - [ ] Admins will be able to delete products.
    - [ ] Admins will be able to view orders.
    - [ ] Admins will be able to edit order status.
    - [ ] Admins will be able to upload images for products.
    - [ ] Admins will be able to change images for products.
    - [ ] Admins will be able to add descriptions for products.
    - [ ] Admins will be able to apply discounts to products.
    - [ ] Admins will be able to view order information including:
        - [ ] Order number
        - [ ] Order date
        - [ ] Order status
        - [ ] Order total
        - [ ] Order items
        - [ ] Order shipping address
        - [ ] Order billing address
        - [ ] Order payment information
    - [ ] Admin will be able to search orders by Order number
    - [ ] Admins will be able to filter orders by status.

### Optional Features
- Wishlist: The ability for Users to be able to save products to wishlist that they can view later.
- Reviews: the ability for users to leave a written review as well as a rating.
- Product Recommendations: The ability for the site to recommend products to users based on their browsing history.

