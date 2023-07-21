const express = require("express");
const app = express();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const cors = require('cors');
app.use(cors());



const axios= require("axios");


const mysql = require('mysql2');

let connection = mysql.createConnection({
  host: "localhost",
  port: 3305,
  user: "root",
  password: "ciaociao19",
  database: "progetto"

});

connection.connect(function (err) {
  if (err) {
    return console.log("Error: " + err.message);
  }
  console.log("Connesso al db!");

});



app.use(express.static('public'));

app.use(bodyParser.json());



app.post("/register", (req, res) => {

  inputData = {
    email: req.body.email,
    password: req.body.password,
    confirm_password: req.body.confirm_password
  }
  if (inputData.confirm_password != inputData.password) {
    res.message = "Le password non corrispondono";
    res.sendStatus(400);
    return;
  }
  var sql = 'SELECT * FROM Utenti WHERE email =?';
  try {
    connection.query(sql, [inputData.email], function (err, data, fields) {
      if (err && err != null) {
        res.message = "Error: " + err.message;
        res.sendStatus(500);
        return;
      }
      else if (data.length > 0) {
        res.message = inputData.email + "già registrata";
        res.sendStatus(409);
        return;
      } else {
        var sql = "INSERT INTO utenti SET ?";
        connection.query(sql, { email: inputData.email, password: inputData.password }, async (err, data) => {
          if (err && err != null) {
            res.message = "Error: " + err.message;
            res.sendStatus(500);
            return;
          }
          res.message = "Registrato con successo";
          res.sendStatus(200);
        });
      }
    })
  } catch (error) {
    console.log(error);
  }

});


app.post("/login", (req, res) => {

  const { email, password } = req.body;

  var sql = 'SELECT * FROM Utenti WHERE email =?';
  connection.query(sql, [email], function (err, data, fields) {
    if (err && err != null) {
      res.message = "Error: " + err.message;
      res.sendStatus(500);
      return;
    }
    else if(data.length == 0){
      res.statusMessage = "Utente non registrato";
      res.sendStatus(404);
      return;
    }
    else if(data[0].password!=password){
      res.statusMessage = "Password Errata";
      res.sendStatus(403);
      return;
    }
    else{
      res.sendStatus(200);
      return;s
    }
  })
})





app.listen(3000, () => {
  console.log("In ascolto sulla porta 3000");
});
