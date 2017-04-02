"use strict"

var express = require('express')
  
var app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')


var Sequelize = require('sequelize')

var sequelize = new Sequelize(
		"testdb",
		"user1",
		"pass1234",
    {
        host : "localhost",
        port : 5432,
        dialect : "postgres"
    })

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(bodyParser.json());

let employee = sequelize.define('employee', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  employmentDate: Sequelize.DATE,
  rate: Sequelize.STRING,
  jobTitle: Sequelize.STRING
})

sequelize.sync()

app.get('/', function (req, res) {
	employee
		.findAll()
		.then(employeeList=>{
            res.render('index',
                { title : 'List',
                    employeeList: employeeList
                })
		})
		.catch(msg=>{
            console.log(msg);
        })
})

app.get('/add', function (req, res) {
  res.render('addemp',
  { title : 'Add an employee' })
})

app.get('/delete', function (req, res) {
    employee
		.destroy({where: {id: req.query.id}})
		.then(()=>{
            employee
                .findAll()
                .then(employeeList=>{
                    res.render('index',
                        { title : 'List',
                            employeeList: employeeList
                        })
                })
                .catch(msg=>{
                    console.log(msg);
                })
		})
		.catch(msg=>{
            console.log(msg);
        })
})

app.post('/save', function (req, res) {
	console.log(req.body);
	if (req.body.submitBtn == "Save") {
        var newEmployee = {};
        newEmployee.firstName = req.body.firstName;
        newEmployee.lastName = req.body.lastName;
        if (req.body.employmentDate != '') {
            newEmployee.employmentDate = req.body.employmentDate;
        } else {
            newEmployee.employmentDate = null;
        }
        newEmployee.rate = req.body.rate;
        newEmployee.jobTitle = req.body.jobTitle;
        console.log(newEmployee);
        employee
            .create(newEmployee)
            .then(createdRecord => {
                employee
                    .findAll()
                    .then(employeeList => {
                        res.render('index',
                            {
                                title: 'List',
                                employeeList: employeeList
                            })
                    })
                    .catch(msg=> {
                        console.log(msg);
                    })
            })
            .catch(msg => {
                console.log(msg);
                res.send({success: false});
            })
    } else {
        employee
            .findAll()
            .then(employeeList => {
                res.render('index',
                    {
                        title: 'List',
                        employeeList: employeeList
                    })
            })
            .catch(msg=> {
                console.log(msg);
            })
    }
})

app.listen(5000)