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
    // addStockProducts();
    displayProducts();
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

function displayProducts () {
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