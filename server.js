const express = require("express");
const app = express();

//prefered port or 3000
const port = process.env.port | 3000;
const mysql = require("mysql");

//opens to cross origin
const cors = require("cors");

app.use(cors());
//express middleware to convert json to javascript objects, neat
app.use(express.json());

app.listen(port, () => {console.log("running")});

//.env configuration
require("dotenv").config({path: "stuff.env"});

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

//checks if its running
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
function ask(question){
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
async function remove(value){
    if (!value) {
        return;
    }
    connection.query("DELETE FROM Jobs WHERE id=" + value, function(error){if (error) {throw error;}})   
    return;
}

//creates a new database row with information
async function add(values){
    connection.query("INSERT Jobs VALUES (" + values[0] + ","+ values[1] +","+ values[2] +","+ values[3] + ","+ values[4]+ ","+ values[5] +")",function(error){if (error) {throw error;}});
    return;
}

//updates content of one entry with the update command
async function update(values){
    connection.query("UPDATE Jobs SET companyname = " + values[1] + ", jobtitle = " + values[2] + ", startdate = " + values[3] + ", enddate = " + values[4] + " WHERE id = " + values[0], function(error){if (error) {throw error;}});
    return;
}


//gets all data
app.get("/data", async (req, res) => {
    let val = await ask("SELECT * FROM Jobs");
    res.json({val});
    res.status(500).send();
})

app.get("/", (req, res) => {
    res.send("I EXIST");
    console.log("test");
    console.log("test");
    res.send("yep");
})

//gets specific information (full mysql call)
app.get("/data/specific", async (req, res) => {
    let val = await ask(req);
    return res.json({val});;
})


app.delete("/remove", async (req, res) => {
    await remove(req);
    res.json({message: "removed: ", req});
})

app.put("/update", async (req, res) => {
    await update(req);
    res.json({message: "updated: ", req});
})

app.post("/add", async (req, res) => {
    await add(req);
    res.json({message: "added: ", req});
})
