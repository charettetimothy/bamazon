DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  price INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department_id VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  over_head_costs INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pancake Mix", "Food", 5, 100),
("Boots", "Clothing", 100, 10),
("Automatic Ball Launcher", "Pet Supplies",100, 5),
("Sweater", "Clothing",40, 50),
("Fire TV", "Electronics", 50, 12),
("Game Monitor", "Electronics", 400, 20),
("Roku Express", "Electronics", 30, 15),
("Tweezers", "Health & Beauty", 10, 5),
("Shampoo", "Health & Beauty", 5, 100),
("Cabin Air Filter", "Automotive", 20, 100)

SELECT * FROM products;