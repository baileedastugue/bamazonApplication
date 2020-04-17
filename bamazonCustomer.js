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
    // addProducts();
})

var insert = "insert into products (product_name, department_name, price, stock_quantity, product_sales) values ?";
var products = [
    ["apple", "grocery", 1.4, 15],
    ["barbells", "fitness", 25, 8],
    ["sticky notes", "home", 5, 10],
    ["stapler", "home", 13.49, 26],
    ["airpods", "technology", 150, 20],
    ["coffee", "grocert", 11.99, 30],
    ["toothpaste", "pharmacy", 6.35, 30]
]
for (var i = 0; i < products.length; i++) 
    {
        products[i].push(products[i][2]*products[i][3]);
    }
console.log(products);


// function addProducts() {
//     for (var i = 0; i < products.length; i++) {
//     var query = connection.query(
//         insert, [], 
//          function (err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " product inserted!\n");
//         })
//     }
// }