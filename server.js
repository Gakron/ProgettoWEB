const express = require("express");
const app = express();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const cors = require('cors');
app.use(cors());



const axios = require("axios");


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
    else if (data.length == 0) {
      res.statusMessage = "Utente non registrato";
      res.sendStatus(404);
      return;
    }
    else if (data[0].password != password) {
      res.statusMessage = "Password Errata";
      res.sendStatus(403);
      return;
    }
    else {
      res.sendStatus(200);
      return; s
    }
  })
})

async function richiestaEsterna(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

app.post('/api/request-to-server', async (req, res) => {
  try {
    const { title, url } = req.body;
    console.log('Titolo:', title);
    console.log('URL:', url);

    const rispostaEsterna = await richiestaEsterna(url);
    console.log('Risposta dal server esterno:', rispostaEsterna);
    for (const movie of rispostaEsterna.Search) {
      Dati = {
        imdbID:movie.imdbID,
        title:movie.Title,
        year:movie.Year,
        type:movie.Type,
        plot:movie.Plot,
        poster:movie.Poster
      }
      console.log(movie.Title)
;      var sql = "INSERT INTO media SET ?";
        connection.query(sql, { imdbID:Dati.imdbID, title:Dati.title, year:Dati.year, type:Dati.type, plot:Dati.plot, poster:Dati.poster },  (err, results) => {
          if (err) {
            console.error('Errore nell\'inserimento dei dati nel database:', err);
            res.status(500).json({ error: 'Errore nell\'inserimento dei dati nel database' });
            return;
          } else {
            // Invia la risposta al client includendo i dati dal server esterno
            console.log("inserito");
          }
        })
    }
    

    // PRIMA DI INVIARE LA RISPOSTA, DEVO SALVARMELI
    res.json({ message: 'Richiesta al server eseguita con successo!', data: rispostaEsterna });
  } catch (error) {
    console.error('Errore nella richiesta al server:', error);
    res.status(500).json({ error: 'Errore nella richiesta al server' });
  }

});




app.listen(3000, () => {
  console.log("In ascolto sulla porta 3000");
});
