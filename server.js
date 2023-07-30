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
      return;
    }
  })
})


app.get('/api/populars/film', (req, res) => {
  try {
    connection.query(
      'SELECT * FROM media WHERE Year = 2023 AND Type = "movie"',
      (err, results) => {
        if (err) {
          console.error('Errore nella verifica dei dati nel database:', err);
          res.status(500).json({ error: 'Errore nella verifica dei dati nel database' });
        } else {
          res.json({ message: 'Query eseguita con successo!', data: results });
        }
      }
    );
  } catch (error) {
    console.error('Errore nella richiesta al server:', error);
    res.status(500).json({ error: 'Errore nella richiesta al server' });
  }
});

app.get('/api/populars/series', (req, res) => {
  try {
    connection.query(
      'SELECT * FROM media WHERE Year = 2023 AND Type = "series"',
      (err, results) => {
        if (err) {
          console.error('Errore nella verifica dei dati nel database:', err);
          res.status(500).json({ error: 'Errore nella verifica dei dati nel database' });
        } else {
          res.json({ message: 'Query eseguita con successo!', data: results });
        }
      }
    );
  } catch (error) {
    console.error('Errore nella richiesta al server:', error);
    res.status(500).json({ error: 'Errore nella richiesta al server' });
  }
});

app.post('/api/real-time-search', async (req, res) => {
  try {
    const { title } = req.body;
    const sql = 'SELECT * FROM media WHERE title LIKE ?';
    connection.query(sql, [`%${title}%`], (err, data) => {
      if (err) {
        console.error('Errore nella verifica dei dati nel database:', err);
        res.status(500).json({ error: 'Errore nella verifica dei dati nel database' });
      } else {
        res.json({ message: 'Richiesta al db eseguita', data });
      }
    });
  } catch (error) {
    console.error('Errore nella richiesta al db:', error);
    res.status(500).json({ error: 'Errore nella richiesta al db' });
  }
});


app.post('/api/request-local', async (req, res) => {
  try {
    const { title, url } = req.body;
    console.log('Titolo:', title);
    console.log("sto chiedendo al db!")
    connection.query(
      'SELECT * FROM media WHERE title LIKE ?',
      [`%${title}%`],
      (err, results) => {
        if (err) {
          console.error('Errore nella verifica dei dati nel database:', err);
          res.status(500).json({ error: 'Errore nella verifica dei dati nel database' });
        } else {
          if (results.length > 0) {
            res.json({ message: 'Richiesta al db eseguita', data: results });
          } else {
            res.json({ message: 'Titolo non trovato nel database', data: null });
          }
        }
      }
    );
  } catch (error) {
    console.error('Errore nella richiesta al db:', error);
    res.status(500).json({ error: 'Errore nella richiesta al db' });
  }
});


async function richiestaEsterna(url) {
  try {
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}


function controllaID(imdbID) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM media WHERE imdbID = ?',
      [imdbID],
      (err, results) => {
        if (err) {
          console.error('Errore nella verifica dei dati nel database:', err);
          reject(err);
        } else if (results.length > 0) {
          resolve(true); // L'imdbID esiste già nel database
        } else {
          resolve(false); // L'imdbID non esiste nel database
        }
      }
    );
  });
}


app.post('/api/request-to-server', async (req, res) => {
  try {
    const { title, url } = req.body;
    console.log('Titolo:', title);
    console.log('URL:', url);
    console.log("oh no sto chiedendo al server!")
    const rispostaEsterna = await richiestaEsterna(url + "type=movie&");
    const rispostaEsterna2 = await richiestaEsterna(url + "type=movie&page=2&");
    const rispostaEsterna3 = await richiestaEsterna(url + "type=series&");
    const rispostaEsterna4 = await richiestaEsterna(url + "type=series&page=2&");

    const concatenatedArray = [
      ...(rispostaEsterna?.Search ?? []),
      ...(rispostaEsterna2?.Search ?? []),
      ...(rispostaEsterna3?.Search ?? []),
      ...(rispostaEsterna4?.Search ?? [])
    ];
    console.log(concatenatedArray)
    //METODO CHE USAVO PRIMA
    // const concatenatedArray = risposteEsternaArray.reduce((result, risposta) => {
    //   const searchArray = risposta?.Search ?? []; // Utilizza un array vuoto come fallback se risposta.Search è undefined
    //   return result.concat(searchArray);
    // }, []);

    if (concatenatedArray.length <= 0) {
      res.json({ message: 'Titolo non trovato online', data: null });
      return
    }

    for (const movie of concatenatedArray) {
      const imdbIDExists = await controllaID(movie.imdbID);
      if (imdbIDExists) {
        continue; // Salta l'iterazione e continua con il prossimo film
      }

      var sql = "INSERT INTO media SET ?";
      connection.query(sql, { imdbID: movie.imdbID, Title: movie.Title, Year: movie.Year, Type: movie.Type, Plot: movie.Plot, Poster: movie.Poster }, (err, results) => {
        if (err) {
          console.error('Errore nell\'inserimento dei dati nel database:', err);
          res.status(500).json({ error: 'Errore nell\'inserimento dei dati nel database' });
          return;
        } else {
          console.log("inserito");
        }
      })
    }

    //ORA CHE LI HO SALVATI POSSO FARE LA RICERCA LOCALE! FINALLY
    res.json({ message: 'Richiesta al server eseguita con successo!', data: concatenatedArray });
  } catch (error) {
    console.error('Errore nella richiesta al server:', error);
    res.status(500).json({ error: 'Errore nella richiesta al server' });
  }

});


app.post('/api/request-plot', async (req, res) => {
  try {
    console.log("sono entrato nella richiesta del plot")
    const { id, url } = req.body;
    console.log(id);
    const response = await axios.get(url + "i=" + id + "&plot=full&");
    const body = {
      Genre: response.data.Genre,
      Runtime: response.data.Runtime,
      Plot: response.data.Plot,
      Released: response.data.Released
    }

    var sql = "UPDATE media SET Runtime = ?, Genre = ?, Plot = ?, Released = ? WHERE imdbID = ?";
    const data = [response.data.Runtime, response.data.Genre, response.data.Plot, response.data.Released, id];
    connection.query(sql, data, (err, results) => {
      if (err) {
        console.error('Errore nell\'aggiornamento dei dati nel database:', err);
        res.status(500).json({ error: 'Errore nell\'aggiornamento dei dati nel database' });
        return;
      } else {
        console.log("aggiornato");
      }
      res.json(body);
    })
  } catch (error) {
    console.error('Errore nella richiesta del plot:', error);
    res.status(500).json({ error: 'Errore nella richiesta del plot' });
  }

});




app.listen(3000, () => {
  console.log("In ascolto sulla porta 3000");
});
