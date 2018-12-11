var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  showTable();
});

function showTable() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function start() {
  inquirer
    .prompt([{
        name: "itemID",
        type: "input",
        message: "What is the product ID of the item you would like to purchase?"
      },
      {
        name: "itemQuantity",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ])
    .then(function (answer) {
      // console.log(answer.itemID)
      // console.log(answer.itemQuantity)
      // if (answer.itemQuantity < stock_quantity){

      // }
      connection.query("SELECT * FROM products WHERE ?", {
        id: answer.itemID
      }, function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
      });
    })
}