#!/bin/bash

# Crea il contenitore Docker con il database MySQL
docker build -t ProgettoWEB .

# Avvia il contenitore
docker run -d -p 3305:3305 --name containerDB mysql:latest

# Attendi che il database sia pronto (utilizzando wait-for-db.bat)
cmd //c "wait-for-db.bat localhost 3305 60"

# Installa le dipendenze dell'app
npm install

# Avvia l'applicazione Node.js
node app/server.js