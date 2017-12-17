var mysql = require('mysql');
var inquirer = require('inquirer');

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "SXGDwyUjchGw6n5u",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
//   console.log("connected as id " + connection.threadId);
//   connection.end();
});

//Lists data for all the products in the products table
function getProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        for(i = 0; i < res.length; i++){
            console.log(`${res[i].item_id} ${res[i].product_name} || ${res[i].department_name} || $${res[i].price} || ${res[i].stock_quantity}\n`);
        }
        customerInput();
    });
}

function customerInput(){
    //Ask customer for product ID and quantity of the item they wish to purchase
    inquirer.prompt([
        {
            message: 'please input the ID of the product you would like to purchase',
            type: "input",
            name: "productID"
        },
        {
            message: "Please insert the quantity that you would like to purchase",
            type: "input",
            name: "quantity"
        }
    ]).then(function(answer){
        //query to find the products they want using the product id they entered.
        connection.query("SELECT * FROM products where ?", [{item_id: answer.productID, }], function(err, response){
            //if nothing gets returned, then the user entered an invalid ID.
            if(response.length !== 0){
                //checks to see if there is enough of the item in stock to sell.
                if(response[0].stock_quantity > answer.quantity){
                    var newQuantity = response[0].stock_quantity - answer.quantity;
                    connection.query("UPDATE PRODUCTS SET stock_quantity = ? where ?", [newQuantity, {item_id: answer.productID}], function(err, response){
                        if(err) throw err;
                        console.log("Success!");
                        connection.end();
                    })
                }
                else{
                    console.log("Sorry, we do not have enough of this item in stock. Please check back at a later time.");
                    getProducts();
                }
            }
            else{
                console.log("Sorry, that item could not be found in our system.");
                getProducts();
            }
        })
    })
}

getProducts();



