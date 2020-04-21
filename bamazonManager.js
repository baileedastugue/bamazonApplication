var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    
    database: "bamazon" 
});

connection.connect(function(err){
    if (err) throw err;
    managerPrompt();
})

function managerPrompt () {
    inquirer
    .prompt ({
        name: "task",
        type: "list",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function(answer) {
        switch(answer.task) {
            case "View Products for Sale":
                displayAllProducts();
                break;
            case "View Low Inventory":
                console.log("View Low I");
                break;
            case "Add to Inventory":
                console.log("add to i");
                break;
            case "Add New Product":
                console.log("add product");
                break;
        }
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