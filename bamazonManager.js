var inquirer = require("inquirer");
managerPrompt();
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
        console.log(answer);
    })
}