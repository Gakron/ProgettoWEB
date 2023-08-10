#!/bin/bash

# Crea il contenitore Docker con il database MySQL
docker build -t ProgettoWEB .

# Avvia il contenitore
docker run -d -p 3305:3305 --name containerDB mysql:latest

# Installa le dipendenze dell'app
npm install

# Avvia l'applicazione Node.js
node app/server.js