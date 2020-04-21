var inquirer = require("inquirer");
var mysql = require("mysql");
var chosenProduct;
var chosenNewAmount;
var allProductNames = [];
var currentStockAmount;
var totalNewAmount;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
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
                lowInventory();
                break;
            case "Add to Inventory":
                createItemDirectory();
                // addToInventory();
                break;
            case "Add New Product":
                console.log("add product");
                break;
        }
    })
}

function lowInventory () {
    var inventorySelection = "select * from products where stock_quantity <5";
    var query = connection.query (inventorySelection, function (err, res) {
        if (err) throw err;
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].product_name + " has low inventory - please restock");
            }
        }    
        else {
            console.log("All products are fully stocked");
        }
        
    })
}

function addToInventory() {
    inquirer.prompt([
        {
            name: "product",
            type: "list",
            choices: allProductNames
        },
        {
            name: "amount",
            type: "input",
            default: 0
        }
    ]).then(function(response){
        chosenProduct = response.product;
        chosenNewAmount = response.amount;
        getCurrentAmount();
    })

}

function createItemDirectory () {
    var query = connection.query("select product_name from products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            allProductNames.push(res[i].product_name);
        }
        addToInventory();
    })
}

function updateAmount () {
    var query = connection.query("update products set ? where ?", 
    [{
        stock_quantity: totalNewAmount
    },
    {
        product_name: chosenProduct
    }], function (err, res) {
        if (err) throw err;
        displayUpdatedAmount();
    })
}

function getCurrentAmount() {
    var query = connection.query("select * from products where ?",
        {
            product_name: chosenProduct
        },
    function(err, res) {
        if (err) throw err;
        currentStockAmount = res[0].stock_quantity;
        totalNewAmount = currentStockAmount + parseInt(chosenNewAmount);
        updateAmount();
    })
}

function displayUpdatedAmount() {
    var query = connection.query("select ? from products",
        {
            product_name: chosenProduct
        },
    function(err, res) {
        if (err) throw err;
        console.log("Product name: " + chosenProduct + " | Number left in stock: " + totalNewAmount);
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