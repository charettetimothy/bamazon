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
    // console.log(res.RowDataPacket[0].id)
    console.table(res);
    start();
  });
}

function start() {
  inquirer
    .prompt([{
        name: "itemID",
        type: "input",
        message: "What is the product ID of the item you would like to purchase?\n"
      },
      {
        name: "itemQuantity",
        type: "input",
        message: "How many would you like to purchase?\n"
      }
    ])
    .then(function (answer) {
      // SELECT * FROM products WHERE ?
      // SELECT stock_quantity FROM products WHERE ?
      connection.query("SELECT * FROM products WHERE ?", {
        id: answer.itemID
      }, function (err, res) {
        if (answer.itemQuantity > res[0].stock_quantity) {
          console.log("\nInsufficient quantity! Please select another item.\n")
          start();
        } else {
          var itemID = answer.itemID;
          var itemQuantity = res[0].stock_quantity - answer.itemQuantity;
          updateTable(itemID, itemQuantity);
        }
        if (err) throw err;
        // connection.end();
      });
    })
}

function updateTable(itemID, itemQuantity) {
  // console.log("Updating all" +   "Rocky Road quantities...\n");
  // var query = connection.query("SELECT * FROM products", function (err, res) {
  //   console.log("Here is a list of our updated inventory.\n")
  //   console.table(res)
  //   console.log(query.sql);
  //   console.log("itemID: " + itemID);
  //   console.log("itemQuantity: " + itemQuantity);
  // });
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
      console.log(res.affectedRows + " products updated!\n");
      inquirer
        .prompt([{
          name: "anotherPurchase",
          type: "confirm",
          message: "Would you like to amke another purchase?\n"
        }])
        .then(function (answer) {
          if (answer.anotherPurchase) {
            showTable();
          }
        })

      //  connection.end();


    })
}