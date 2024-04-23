const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const port = process.env.port | 3000;

//app.set("view engine", "ejs");
//app.use(express.static("content"));
app.use(express.json);
app.use(cors());
var bodyParser = require('body-parser');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



app.listen(port, () => {console.log("running")});

//sql
const mysql = require('mysql');
const initial = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

initial.connect();

//adds the database, probaly not needed in this case but might be nice
initial.query("CREATE DATABASE IF NOT EXISTS Labb2Backend",function(error){if (error) {throw error;}})

initial.end()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect();

connection.query("CREATE TABLE IF NOT EXISTS Jobs (id Int NOT NULL PRIMARY KEY, companyname varchar(20), jobtitle varchar(20), startdate DATE, enddate DATE)", function(error){if (error) {throw error;}})

connection.query("SELECT id FROM Jobs", function(error, results) {
    if (error) {
        throw error;
    }
    //populates if empty
    if (!results[0]) {
        create();
    }
})

function create() {
    
    connection.query("INSERT Jobs VALUES (1,'Glassbolaget','Glassman','2022-02-14','2022-08-17')",function(error){if (error) {throw error;}})
    connection.query("INSERT Jobs VALUES (2,'Glassbolaget2','GlassSergant','2023-02-14','2022-08-17')",function(error){if (error) {throw error;}})
    connection.query("INSERT Jobs VALUES (3,'Glassbolaget3','GlassGeneral','2024-01-14','CURDATE()')",function(error){if (error) {throw error;}})
}

app.listen(port, () => {
    console.log("server is running:" + port)
});

app.post("/POST",  async function name(req, res) {
    await removeEntry(req.body);
    res.redirect("/");
})
