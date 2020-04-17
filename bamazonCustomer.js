// require("dotenv").config();
var mysql = require("mysql");
// var password = require("./pw.js");
// console.log(password.mySQLpw);

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon" 
});

connection.connect(function(err){
    if (err) throw err;
    console.log("hey");
    displayItemName();
    // addStockProducts();
    // displayAllProducts();
   
})

var insert = "insert into products (product_name, department_name, price, stock_quantity, product_sales) values ?";
var stockProducts = [
    ["apple", "grocery", 1.4, 15],
    ["barbells", "fitness", 25, 8],
    ["sticky notes", "home", 5, 10],
    ["stapler", "home", 13.49, 26],
    ["airpods", "technology", 150, 20],
    ["coffee", "grocert", 11.99, 30],
    ["toothpaste", "pharmacy", 6.35, 30]
]
for (var i = 0; i < stockProducts.length; i++) 
    {
        stockProducts[i].push(stockProducts[i][2]*stockProducts[i][3]);
    }

function addStockProducts() {
    var query = connection.query(
        insert, [stockProducts], 
         function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " row inserted!\n");
        })
}
var newAmount;
function checkQuantity () {
    var check = "select product_name, stock_quantity, price from products where ?"
    var query = connection.query(check, 
        {
            product_name: chosenProduct
        }, function (err, res) {
            if (err) throw err;
            if (parseFloat(res[0].stock_quantity) >= chosenAmount) {
                newAmount = parseFloat(res[0].stock_quantity) - chosenAmount;
                console.log(res[0].stock_quantity);
                console.log(chosenAmount);
                console.log(newAmount);
                updateAmount();
            }
            else {
                console.log("insufficient quantity");
            }
    })
}
var totalPrice = 0;
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

function displayAllProducts () {
    var display = "select * from products";
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
        }
    )
}
var allProductNames = [];
function displayItemName () {
    var query = connection.query("select product_name from products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            allProductNames.push(res[i].product_name);
        }
        customerPrompt();
    })
}
var chosenProduct = "";
var chosenAmount;
var inquirer = require("inquirer");
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
        console.log("Product pulled from back! Total cost: $" + totalPrice);
    })
}