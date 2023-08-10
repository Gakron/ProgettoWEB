@echo off

REM Verifica se Docker è installato
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    REM Docker non è installato, esegui l'installazione
    echo Installing Docker...
    curl -fsSL https://get.docker.com -o get-docker.bat
    call get-docker.bat

    REM Avvia il servizio Docker
    echo Starting Docker service...
    sc start Docker

    REM Attendi che Docker sia avviato
    timeout /t 10
)

REM Esegui il comando che richiede Docker
docker run hello-world