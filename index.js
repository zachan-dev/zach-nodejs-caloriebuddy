//index.js file
require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 8089;

const viewsDir = process.env.VIEWSDIR || ""; // for routing use

/** Database Coonection */
const db = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DBHOST || "localhost",
    user: process.env.DBUSER || "zach",
    password: process.env.DBPASSWORD || "zach",
    database: process.env.DBNAME || "uol_cm2040_caloriebuddy"
});
//connect to database, will be connected and released during queries
// db.connect((err) => {
//     if(err) {
//         throw err; 
//     }
//     console.log("Connected to database");
// });
global.db = db;

/** POST Req.Body Parser */
app.use(bodyParser.urlencoded({ extended: true }));

/** Static Files */
app.use('/assets', express.static(__dirname + '/views/assets')); // serves assets public

/** Set Templating Engine */
app.use(expressLayouts)
app.set("layout", __dirname + "/views/_Layout.html")
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

/** Routes */
require("./routes/main")(app, viewsDir);

app.listen(port, () => {
  console.log("Welcome to the mid-term application!");
  //console.log("This application must run on PORT 8089");
  console.log(`CalorieBuddy listening on port ${port}!`)
});


// var http = require("http");

// http
//   .createServer(function(req, res) {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.write("Welcome to the mid-term application! \n\n");
//     res.write("This application must run on PORT 8089");
//     res.end();
//   })
//   .listen(8089, function() {
//     console.log("Node server is running...");
//   });


/** MySQL Database setup, steps
 * 
 * CREATE TABLE `calorieBuddy`.`foods` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `typicalValue` DECIMAL(5,2) UNSIGNED NOT NULL,
  `unit` VARCHAR(50) NOT NULL,
  `calories` DECIMAL(5,2) UNSIGNED NOT NULL,
  `carbs` DECIMAL(5,2) UNSIGNED NOT NULL,
  `fat` DECIMAL(5,2) UNSIGNED NOT NULL,
  `protein` DECIMAL(5,2) UNSIGNED NOT NULL,
  `salt` DECIMAL(5,2) UNSIGNED NOT NULL,
  `sugar` DECIMAL(5,2) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`))
 * 
 */
