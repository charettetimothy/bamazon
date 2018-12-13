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
        message: "What is the product ID of the item you would like to purchase? "
      },
      {
        name: "itemQuantity",
        type: "input",
        message: "How many would you like to purchase? "
      }
    ])
    .then(function (answer) {
      // SELECT stock_quantity FROM products WHERE ?
      connection.query("SELECT * FROM products WHERE ?", {
        id: answer.itemID
      }, function (err, res) {
        if (answer.itemQuantity > res[0].stock_quantity) {
          console.log("\nInsufficient quantity! Would you like to make another purchase?\n")
          anotherPurchaseDos();
        } else {
          var itemID = answer.itemID;
          var itemQuantity = res[0].stock_quantity - answer.itemQuantity;
          var totalCost = res[0].price * answer.itemQuantity
          updateTable(itemID, itemQuantity, totalCost);
        }
        if (err) throw err;
      });
    })
}

function updateTable(itemID, itemQuantity, totalCost) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: itemQuantity
      },
      {
        id: itemID
      }
    ],
    function (err, res) {
      console.log("\nGreat here you go. Your total for this transaction is $" + totalCost + ".\n" + res.affectedRows + " products updated!\n");
      inquirer
        .prompt([{
          name: "anotherPurchase",
          type: "confirm",
          message: "Would you like to make another purchase?\n"
        }])
        .then(function (answer) {
          if (answer.anotherPurchase) {
            showTable();
          } else  {
            connection.end();
          }
        })
    })
}

function anotherPurchaseDos() {
  inquirer
      .prompt([{
          name: "anotherPurchaseDos",
          type: "confirm",
          message: "Would you like to make another purchase?"
      }])
      .then(function (answer) {
          if (answer.anotherPurchaseDos) {
              showTable();
          } else {
              console.log("Ok. Have a great day! GoodBye.")
              connection.end();
          }
      })
}