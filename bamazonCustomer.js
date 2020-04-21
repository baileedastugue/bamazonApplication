// require("dotenv").config();
var mysql = require("mysql");
// var password = require("./pw.js");
// console.log(password.mySQLpw);

var insert = "insert into products (product_name, department_name, price, stock_quantity, product_sales) values ?";
var stockProducts = [
    ["apple", "grocery", 1.4, 15],
    ["barbells", "health, beauty, & fitness", 25, 8],
    ["sticky notes", "electronics & office", 5, 10],
    ["stapler", "electronics & office", 13.49, 26],
    ["airpods", "electronics & office", 150, 20],
    ["coffee", "grocery", 11.99, 30],
    ["toothpaste", "pharmacy", 6.35, 30]
]
for (var i = 0; i < stockProducts.length; i++) 
    {
        stockProducts[i].push(stockProducts[i][2]*stockProducts[i][3]);
    }
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
    
    database: "bamazon" 
});

connection.connect(function(err){
    if (err) throw err;
    deleteTableData();   
})

// deletes table data 
function deleteTableData () {
    var query = connection.query("delete from products", function (err, res) {
        if (err) throw err;
        console.log("Welcome");
        addStockProducts();
    })
}

// adds data from the array 
function addStockProducts() {
    var query = connection.query(
        insert, [stockProducts], 
         function (err, res) {
            if (err) throw err;
            displayAllProducts();
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
