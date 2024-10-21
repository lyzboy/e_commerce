CREATE DATABASE ecommerce

CREATE TABLE account (
    
)

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    account_id varchar()
    CONSTRAINT fk_account
        FOREIGN KEY(account_id)
            REFERENCES account(email)
)