//needed imports
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

//.env configuration
require("dotenv").config();

//creates app with either prefered port or 3000
const app = express();
const port = process.env.port | 3000;

//app.set("view engine", "ejs");
//app.use(express.static("content"));

//express middleware to convert json to javascript objects, neat
app.use(express.json);

//opens to cross origin
app.use(cors());

//checks if its running
app.listen(port, () => {console.log("running")});

//initial mysql call for creating database if it dosent exist
const initial = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

//adds the database, probaly not needed in this case but might be nice
initial.connect();
initial.query("CREATE DATABASE IF NOT EXISTS Labb2Backend",function(error){if (error) {throw error;}})
initial.end()

//the "real" database connection which will be used for data storage
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect();

//makes sure the table exists
connection.query("CREATE TABLE IF NOT EXISTS Jobs (id Int NOT NULL PRIMARY KEY, companyname varchar(20), jobtitle varchar(20), startdate DATE, enddate DATE)", function(error){if (error) {throw error;}})

//tries initial query and if empty populates
connection.query("SELECT id FROM Jobs", function(error, results) {
    if (error) {
        throw error;
    }
    //populates if empty
    if (!results[0]) {
        create();
    }
})

//Template objects
function create() {
    connection.query("INSERT Jobs VALUES (1,'Glassbolaget','Glassman','2022-02-14','2022-08-17')",function(error){if (error) {throw error;}})
    connection.query("INSERT Jobs VALUES (2,'Glassbolaget2','GlassSergant','2023-02-14','2022-08-17')",function(error){if (error) {throw error;}})
    connection.query("INSERT Jobs VALUES (3,'Glassbolaget3','GlassGeneral','2024-01-14','CURDATE()')",function(error){if (error) {throw error;}})
}

//generall function to ask database questions
function GET(question){
    //works on asyncronus promises
    return new Promise((resolve, reject) => {
        //tries to ask if fail will return error
        try {
            connection.query(question, function (error, result) {
                //if database error  
                if (error) {
                    return reject(error);
                }
                return resolve(result);
                })   
        } catch (e) {
            reject(e)
        }
    })
}

//removes a database row after id
async function DELETE(value){
    if (!value) {
        return;
    }
    connection.query("DELETE FROM Jobs WHERE id=" + value, function(error){if (error) {throw error;}})   
    return;
}

//creates a new database row with information
async function POST(values){
    connection.query("INSERT Jobs VALUES (" + values[0] + ","+ values[1] +","+ values[2] +","+ values[3] + ","+ values[4]+ ","+ values[5] +")",function(error){if (error) {throw error;}});
    return;
}

//updates content of one entry with the update command
async function PUT(values){
    connection.query("UPDATE Jobs SET companyname = " + values[1] + ", jobtitle = " + values[2] + ", startdate = " + values[3] + ", enddate = " + values[4] + " WHERE id = " + values[0], function(error){if (error) {throw error;}});
    return;
}


//gets all data
app.get("/GET", async (req, res) => {
    await GET("SELECT * FROM Jobs");
    return res;
})

//gets specific information (full mysql call)
app.get("/GET/info", async (req, res) => {
    await GET(req);
    return res;
})

app.post("/DELETE", async (req, res) => {
    await DELETE(req);
})

app.post("/PUT", async (req, res) => {
    await PUT(req);
})

app.post("/POST", async (req, res) => {
    await POST(req);
})

