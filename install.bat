@echo off

REM Esegui lo script di installazione di Docker (se necessario)
where docker > nul 2>&1
if %errorlevel% neq 0 (
    call docker_install.bat
)

REM Crea il contenitore Docker con il database MySQL
docker build -t ProgettoWEB .

REM Avvia il contenitore
docker run -d -p 3305:3305 --name containerDB mysql:latest

REM Attendi che il database sia pronto (utilizzando wait-for-db.bat)
cmd //c "wait-for-db.bat localhost 3305 60"

REM Installa le dipendenze dell'app
npm install

REM Avvia l'applicazione Node.js
node app/server.js