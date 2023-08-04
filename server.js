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
  var sql = 'SELECT * FROM Utenti WHERE username =?';
  try {
    connection.query(sql, [inputData.email], function (err, data, fields) {
      if (err && err != null) {
        res.message = "Error: " + err.message;
        res.sendStatus(500);
        return;
      }
      else if (data.length > 0) {
        res.message = inputData.email + "già registrato";
        res.sendStatus(409);
        return;
      } else {
        var sql = "INSERT INTO utenti SET ?";
        connection.query(sql, { username: inputData.email, password: inputData.password }, async (err, data) => {
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

  var sql = 'SELECT * FROM Utenti WHERE username =?';
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
      'SELECT * FROM media WHERE Year = 2023 AND Type = "movie" AND Poster <> "N/A"',
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
      'SELECT * FROM media WHERE Year = 2023 AND Type = "series" AND Poster <> "N/A"',
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


app.post('/api/request-to-server-better', async (req, res) => {
  try {
    const { title, url } = req.body;
    console.log('Titolo:', title);
    console.log('URL:', url);
    console.log("oh no sto chiedendo al server!")
    const rispostaEsterna = await richiestaEsterna(url + "type=movie&page=1&");
    const rispostaEsterna2 = await richiestaEsterna(url + "type=movie&page=2&");
    const rispostaEsterna3 = await richiestaEsterna(url + "type=movie&page=3&");
    const rispostaEsterna4 = await richiestaEsterna(url + "type=movie&page=4&");
    const rispostaEsterna5 = await richiestaEsterna(url + "type=movie&page=5&");


    const rispostaEsterna6 = await richiestaEsterna(url + "type=series&page=1&");
    const rispostaEsterna7 = await richiestaEsterna(url + "type=series&page=2&");
    const rispostaEsterna8 = await richiestaEsterna(url + "type=series&page=3&");
    const rispostaEsterna9 = await richiestaEsterna(url + "type=series&page=4&");
    const rispostaEsterna10 = await richiestaEsterna(url + "type=series&page=5&");


    const concatenatedArray = [
      ...(rispostaEsterna?.Search ?? []),
      ...(rispostaEsterna2?.Search ?? []),
      ...(rispostaEsterna3?.Search ?? []),
      ...(rispostaEsterna4?.Search ?? []),
      ...(rispostaEsterna5?.Search ?? []),
      ...(rispostaEsterna6?.Search ?? []),
      ...(rispostaEsterna7?.Search ?? []),
      ...(rispostaEsterna8?.Search ?? []),
      ...(rispostaEsterna9?.Search ?? []),
      ...(rispostaEsterna10?.Search ?? [])

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
  const connection1 = connection.promise()
  const { id, url, username } = req.body;
  let query = "SELECT * FROM media WHERE imdbID = ?";

  await connection1.query(query, [id]).then(async (results) => {
    if (results[0][0].Plot) {
      let query = "SELECT * FROM visti WHERE username = ? AND id_film = ?";
      await connection1.query(query, [username, id]).then(async (results2) => {
        if (results2[0].length > 0) {
          const body = {
            Genre: results[0][0].Genre,
            Runtime: results[0][0].Runtime,
            Plot: results[0][0].Plot,
            Released: results[0][0].Released,
            Seen: true
          }
          res.json(body);
        }
        else {
          console.log("ho il plot, ma non ho visto il film");
          const response = await axios.get(url + "i=" + id + "&plot=full&");
          var sql = "UPDATE media SET Runtime = ?, Genre = ?, Plot = ?, Released = ? WHERE imdbID = ?";
          const data = [response.data.Runtime, response.data.Genre, response.data.Plot, response.data.Released, id];
          await connection1.query(sql, data).then((results3) => {
            const body = {
              Runtime: data[0],
              Genre: data[1],
              Plot: data[2],
              Released: data[3],
              Seen: false
            }

            res.json(body);
          })
        }
      })
    }
    else {
      console.log("non ho il plot, quindi non posso aver visto il film");
      const response = await axios.get(url + "i=" + id + "&plot=full&");
      var sql = "UPDATE media SET Runtime = ?, Genre = ?, Plot = ?, Released = ? WHERE imdbID = ?";
      const data = [response.data.Runtime, response.data.Genre, response.data.Plot, response.data.Released, id];
      await connection1.query(sql, data).then((results3) => {
        const body = {
          Runtime: data[0],
          Genre: data[1],
          Plot: data[2],
          Released: data[3],
          Seen: false
        }

        res.json(body);
      }).catch((err) => {
        console.error('Errore nel caso in cui ho il plot', err);
        res.status(500).json({ error: 'Errore nel caso in cui ho il plot' });
      })
    }

  }).catch((err) => {
    console.error('Errore nel caso in cui ho il plot', err);
    res.status(500).json({ error: 'Errore nel caso in cui ho il plot' });
  })
})


async function controllaSeGiàVisto(utente, id) {
  const connection1 = connection.promise();
  try {
    const results = await connection1.query("SELECT * FROM visti WHERE username = ? AND id_film = ?", [utente, id]);
    console.log(results[0].length);
    return results[0].length;
  } catch (err) {
    console.error('Errore nella verifica dei dati nel database:', err);
    throw err;
  }
}


app.post('/api/mark-as-watched', async (req, res) => {
  const { id, utente, date } = req.body;

  try {
    // Controlla se il film è già stato segnato come visto dall'utente
    const giàVisto = await controllaSeGiàVisto(utente, id);
    console.log("sono nel controlloGiàVisto", giàVisto);

    if (giàVisto) {
      res.send("Già visto");
      return;
    }

    const connection1 = connection.promise();
    // Recupera il tipo di film dalla tabella 'media'
    const risultato = await connection1.query("SELECT Type FROM media WHERE imdbID = ?", id);

    // Inserisce la nuova voce nella tabella 'visti'
    const insertResult = await connection1.query("INSERT INTO visti SET ?", {
      username: utente,
      id_film: id,
      tipo: risultato[0].Type,
      data_visione: date
    });

    console.log("inserito");
    res.send("Film segnato come già visto!");
  } catch (err) {
    console.error('Errore nell\'inserimento dei dati nel database:', err);
    res.status(500).json({ error: 'Errore nell\'inserimento dei dati nel database' });
  }
});





app.post('/api/get-watched', async (req, res) => {

  const username = req.body.username;
  let tot_film = 0;
  let tot_serie = 0;
  let tempo_film = 0;

  const queryVisti = `SELECT id_film FROM visti WHERE username = ?`;
  connection.query(queryVisti, [username], (err, resultsVisti) => {
    if (err) throw err;

    //ho preso tutti i film visti nel formato {id_film: 'id'}
    const filmVistiIds = resultsVisti.map((row) => row.id_film);

    //adessp ho tutti i film visti qui {'id','id','id'};
    // console.log(filmVistiIds);

    const queryMedia = `SELECT imdbID, Runtime, Type FROM media WHERE imdbID IN (?)`;

    connection.query(queryMedia, [filmVistiIds], (err, resultsMedia) => {
      if (err) throw err;
      //Ora dentro result media ho gli id dei film e il runtime di ogni film


      const updatedMediaArray = resultsMedia.map((media) => ({
        ...media, // Manteniamo gli altri campi inalterati
        Runtime: media.Runtime.replace(' min', ''), // Rimuoviamo la parola "min" dal campo "Runtime"
      }));

      updatedMediaArray.forEach(media => {
        if (media.Type === "series") {
          tot_serie++;
        }
        if (media.Type === "movie") {
          tot_film++;
          if (media.Runtime !== 'N/A') {
            tempo_film = tempo_film + parseInt(media.Runtime);
          }
        }
      });


      res.json({
        tot_film: tot_film,
        tot_serie: tot_serie,
        tempo_film: tempo_film,
      });
    })
  })
})


app.post('/api/get-comments-number', async (req, res) => {

  const username = req.body.username;

  const query = `SELECT username FROM commenti WHERE username = ?`;
  connection.query(query, [username], (err, data) => {
    if (err) throw err;
    res.json(data.length);
  })

})



app.post('/api/seen-films', async (req, res) => {

  const username = req.body.username;
  let query = `SELECT id_film FROM visti WHERE username = ?`;
  connection.query(query, [username], async (err, data) => {
    if (err) throw err;

    const filmVistiIds = data.map((row) => row.id_film);

    if (filmVistiIds.length === 0) {

      res.json({ message: "nessun risultato" })
      return;
    }
    let secondQuery = "SELECT * FROM media";
    if (filmVistiIds.length > 0) {
      secondQuery += " WHERE imdbID IN (?)";
    }

    connection.query(secondQuery, [filmVistiIds], async (err, resultsMedia) => {
      if (err) throw err;

      res.json({ resultsMedia });
    })
  })
})

app.post('/api/submit-comment', async (req, res) => {
  const { username, id, comment, data } = req.body;

  let query = "INSERT INTO commenti SET ?";
  connection.query(query, { username: username, id_film: id, commento: comment, data_commento: data }, async (err, results) => {
    if (err) {
      console.error('Errore nell\'inserimento del commento nel database:', err);
      res.status(500).json({ error: 'Errore nell\'inserimento del commento nel database' });
      return;
    } else {
      res.json({ message: "inserito" });
    }

  })
})


app.post('/api/retrieve-comments', async (req, res) => {
  const { id } = req.body;

  let query = "SELECT * FROM commenti WHERE id_film=?";

  connection.query(query, [id], async (err, data) => {
    if (err) throw err;
    if (data.length > 0) {
      res.json({ data });
    }
    else {
      res.json({ message: "nessun commento" });

    }

  })
})


app.listen(3000, () => {
  console.log("In ascolto sulla porta 3000");
})
