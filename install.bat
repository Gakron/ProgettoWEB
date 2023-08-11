@echo off

REM Controlla se Node.js è installato
where node > nul 2>&1
if %errorlevel% neq 0 (
    REM Esegui il processo di installazione di Node.js
    REM Puoi modificare questo comando con l'installazione corretta per il tuo sistema
    REM Ad esempio, scaricare l'installer da https://nodejs.org/ e modificarlo di conseguenza
    echo Installazione di Node.js...
    start /wait node-v18.17.1-x64.msi
)


echo Script completato.
pause