let mysql = require("mysql");
let inquirer = require("inquirer")
let cTable = require("console.table")

let connection = mysql.createConnection({
  host: "localhost",

  // port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "annixter",
  database: "employees_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  startApp()
});

function startApp() {
  inquirer
  .prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees by Department",
      "View All Employees by Roles",
      "Update Employee Role",
      "Add Employee",
      "Add Department",
      "Delete Employee",
      "Exit"
    ]
  })
  .then(function(answer){
    switch(answer.action) {
      case "View All Employees":
      viewAllEmployees()
      break

      case "View All Employees by Department":
      viewAllEmployeesByDepartment()
      break

      case "View All Employees by Roles":
      viewAllEmployeesByRoles()
      break

      case "Update Employee Role":
      updateEmployeeRole()
      break

      case "Add Employee":
      addEmployee()
      break

      case "Add Department":
      addDepartment()
      break

      case "Delete Employee":
      deleteEmployee()
      break

      case "Exit":
      connection.end()

    }
  })
}

const viewAllEmployees = () => {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS manager FROM employees_db.employee LEFT JOIN employees_db.role On employee.role_id = role.id LEFT JOIN employees_db.department ON role.department_id = department.id", function (err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
  });

}

const viewAllEmployeesByDepartment = () => {
  connection.query("SELECT employee.id,employee.first_name,employee.last_name,department.name AS Department FROM employees_db.employee LEFT JOIN employees_db.role ON employee.role_id = role.id LEFT JOIN employees_db.department ON role.department_id = department.id ", function (err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
  });

}

const viewAllEmployeesByRoles = () => {
  connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      console.table(res);
      startApp();
  });

}

const updateEmployeeRole = () => {
  inquirer
  .prompt([
    {
    name: "employee",
    type: "input",
    message: "Which employee's role would you like to update? (Please enter the employee's ID)"
    },

    {
    name: "newRole",
    type: "input",
    message: "What new role would you like to assign? (Please enter a role ID)"
    },

    ])
  .then(function (answer) {
    connection.query(
      "UPDATE employee SET ? where ?",
        [
        {
        role_id: answer.newRole
        },
        {
        id: answer.employee
        }
        ],
        function (err) {
        if (err) throw err;
        console.log("The employee's role has been updated successfully!");
        startApp();
     }
   );
  });
}

const addEmployee =() => {
  inquirer
  .prompt([
    {
    name: "first_name",
    type: "input",
    message: "What is the employee's first name?"
    
    },
    {
    name: "last_name",
    type: "input",
    message: "What is the employee's last name?"
    },
    {
    name: "role",
    type: "input",
    message: "What is the employee's role? (Please enter a role ID)?"
    }

  ])
  .then(function(answer){
    connection.query(
      "INSERT INTO Employee SET ?",
      {
        first_name: answer.first_name,
        last_name : answer.last_name,
        role_id: answer.role
      },
      function (err) {
        if (err) throw err
        console.log("You have successfully added an employee!")
        startApp();
      }
    )

  })
}

const addDepartment =() => {
  inquirer
  .prompt([
    {
    name: "department",
    type: "input",
    message: "What department would you like to add?"
    
    } 
  ])
  .then(function(answer){
    connection.query(
      "INSERT INTO Department SET ?",
      {
        name: answer.department,
      },
      function (err) {
        if (err) throw err
        console.log("You have successfully added a department!")
        startApp();
      }
    )

  })
}

const deleteEmployee =() => {
  inquirer
  .prompt([
    {
    name: "employee",
    type: "input",
    message: "Which employee would you like to delete? (Please enter employee's ID)"
    
    } 
  ])
  .then(function(answer){
    connection.query(
      "DELETE FROM employee WHERE ?",
      {
        id: answer.employee,
      },
      function (err) {
        if (err) throw err
        console.log("You have successfully deleted an employee!")
        startApp();
      }
    )

  })
}

