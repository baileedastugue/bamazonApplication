// require("dotenv").config();
var mysql = require("mysql");
// var password = require("./pw.js");
// console.log(password.mySQLpw);

var allProductNames = [];
var chosenProduct = "";
var chosenAmount;
var totalPrice = 0;
var newAmount;
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon" 
});

connection.connect(function(err){
    if (err) throw err;
    displayAllProducts();
})

function displayAllProducts () {
    var display = "select item_id, product_name, department_name, price, stock_quantity, (price*stock_quantity) AS product_sales from products";
    var query = connection.query(
        display, function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].item_id + 
                "\nProduct Name: " + res[i].product_name + 
                "\nDepartment Name: " + res[i].department_name + 
                "\nPrice: " + res[i].price + 
                "\nQuantity in Stock: " + res[i].stock_quantity + 
                "\nProduct Sale: " + res[i].product_sales +
                "\n=========================");
            }
            displayItemName();
        }
    )
}

function displayItemName () {
    var query = connection.query("select product_name from products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            allProductNames.push(res[i].product_name);
        }
        customerPrompt();
    })
}

function customerPrompt() {
    inquirer
    .prompt([
        
        {
            name: "productName",
            type: "list",
            choices: allProductNames
        },
        {
            name: "productQuantity",
            type: "input",
            validate: function(value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        chosenProduct = answer.productName;
        chosenAmount = answer.productQuantity;
        checkQuantity();
    })
};

function checkQuantity () {
    var check = "select product_name, stock_quantity, price from products where ?"
    var query = connection.query(check, 
        {
            product_name: chosenProduct
        }, function (err, res) {
            if (err) throw err;
            if (parseFloat(res[0].stock_quantity) >= chosenAmount) {
                newAmount = parseFloat(res[0].stock_quantity) - chosenAmount;
                updateAmount();
            }
            else {
                console.log("Insufficient quantity available");
                customerPrompt();
            }
    })
}

function updateAmount () {
    var query = connection.query("update products set ? where ?", 
    [{
        stock_quantity: newAmount
    },
    {
        product_name: chosenProduct
    }], function (err, res) {
        if (err) throw err;
        displayUpdatedAmount();
        findPrice();
    })
}

function displayUpdatedAmount() {
    var query = connection.query("select ? from products",
        {
            product_name: chosenProduct
        },
    function(err, res) {
        if (err) throw err;
        console.log("Product name: " + chosenProduct + " || Number left in stock: " + newAmount);
    })
}

function findPrice() {
    var query = connection.query("select price from products where ?", 
    {
        product_name: chosenProduct
    }, function (err, res) {
        if (err) throw err;
        totalPrice = parseFloat(res[0].price) * parseInt(chosenAmount);
        console.log("Product pulled for you! Your total: $" + totalPrice);
        customerPrompt();
    })
}
