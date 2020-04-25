var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");
var prompt;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon" 
});

connection.connect(function(err){
    if (err) throw err;
    promptSupervisor();
})

var table = new Table({
    head: ["department_id", "department_name", "product_sales", "overhead_costs", "total_profit"],
    colWidths: [15, 28, 15, 16, 14]
});

function totalSales () {
    var drop = "drop table if exists totalSales";
    var query = connection.query(drop, function (err, res) {
        if (err) throw err;
    })
    var create = "create table totalSales select department_name, SUM(price*stock_quantity) AS product_sales from products group by department_name";
    var query = connection.query(create, function (err, res) {
        if (err) throw err;
        joinTables()
    })
}

function joinTables() {
    var join = "SELECT department_id, departments.department_name, product_sales, overhead_costs, (product_sales-overhead_costs) AS total_profit FROM totalSales RIGHT JOIN departments ON departments.department_name = totalSales.department_name ORDER BY department_id";
    var query = connection.query(join, function (err, res) {
        if (err) throw err;
        if (prompt === "View Product Sales by Department") {
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_sales == null) {
                    res[i].product_sales = 0;
                    res[i].total_profit = res[i].product_sales-res[i].overhead_costs;
                }
                table.push([res[i].department_id, res[i].department_name, res[i].product_sales, res[i].overhead_costs, res[i].total_profit]);
            }
            console.log(table.toString());
        }
        else {
            addDepartment();
        }
    })
}

function promptSupervisor () {
    inquirer
    .prompt(
        {
            name: "action",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ).then(function(response) {
        prompt = response.action;
        totalSales();
    })
}

function addDepartment() {
    inquirer
    .prompt([
        {
            name: "name",
            type: "input"
        },
        {
            name: "costs",
            type: "input"
        }
    ]).then(function(response){
        var insert = "INSERT INTO departments (department_name, overhead_costs) values ?"
        var newDep = [[response.name, parseFloat(response.costs)]];
        var query = connection.query(
            insert, [newDep], 
             function (err, res) {
                if (err) throw err;
            })
        console.log(response.name + " added to departments!");
    })
}