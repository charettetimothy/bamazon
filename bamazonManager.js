var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});

function start() {
    inquirer
        .prompt([{
            name: "managersChoice",
            type: "rawlist",
            message: "What department would you like to see? ",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End shift and go home!"]
        }])
        .then(function (answer) {
            var managersChoice = answer.managersChoice
            switch (managersChoice) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
                case "End shift and go home!":
                    console.log("Goodnight!")
                    connection.end();
                    break;
                default:
                    console.log("You messed up kid!")
            }
        })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("Here is a list of our updated inventory.")
        console.table(res);
        managerPromptDos();
    });
}

function viewLowInventory() {
    connection.query("SELECT product_name, stock_quantity FROM products", function (err, res) {
        if (err) throw err;
        // filter function- returns a new array (lowInventoryArray) from an existing array (res) 
        // by using the filter method and passing a function because a functioin sometiumies wants 
        // an argument ie.-variable
        const lowInventoryArray = res.filter(prodObj => prodObj.stock_quantity <= 5);
        console.log(lowInventoryArray)
        managerPromptDos();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("Here is an updated list of our current inventory.")
        console.table(res)
        inquirer
            .prompt([{
                    name: "managerProduct",
                    type: "input",
                    message: "What product will you be adding today?"
                },
                {
                    name: "managerQuantity",
                    type: "input",
                    message: "How many would you like to add?"
                }
            ])
            .then(function (answer) {
                var managerProduct = answer.managerProduct;
                var managerQuantity = answer.managerQuantity;
                let sqlQuery = `update products set stock_quantity = stock_quantity + ${managerQuantity} where id = ${managerProduct}`
                connection.query(sqlQuery, function () {
                    console.log("Update Successful. Here is an updated inventory list.");
                    viewProducts();
                })
            })
    });
}

function managerPromptDos() {
    inquirer
        .prompt([{
            name: "anotherTask",
            type: "confirm",
            message: "Is there anything else I can do for you?"
        }])
        .then(function (answer) {
            if (answer.anotherTask) {
                start();
            } else {
                console.log("Ok. Have a great day! GoodBye.")
                connection.end();
            }
        })
}

function addNewProduct() {
    inquirer
        .prompt([{
                name: "managerProduct",
                type: "input",
                message: "What is the name of the product you would like to add?"
            },
            {
                name: "managerDepartment",
                type: "input",
                message: "What department would you like to place it in?"

            },
            {
                name: "managerPrice",
                type: "input",
                message: "What would you like to set the cost to be?"
            },
            {
                name: "managerQuantity",
                type: "input",
                message: "How many would you like to add to our inventory?"
                
            }
        ])
        .then(function (answer) {
            var managerProduct = answer.managerProduct;
            var managerDepartment = answer.managerDepartment;
            var managerQuantity = answer.managerQuantity;
            var managerPrice = answer.managerPrice;
            var sqlQuery = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
            var values = [
                [managerProduct, managerDepartment, managerPrice, managerQuantity]
            ];
            connection.query(sqlQuery, [values], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
                viewProducts();
            });
        });
}

start();