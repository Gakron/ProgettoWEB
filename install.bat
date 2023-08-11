@echo off

REM Controlla se Node.js è installato
where node > nul 2>&1
if %errorlevel% neq 0 (
    REM Esegui il processo di installazione di Node.js
    REM Puoi modificare questo comando con l'installazione corretta per il tuo sistema
    REM Ad esempio, scaricare l'installer da https://nodejs.org/ e modificarlo di conseguenza
    echo Installazione di Node.js...
    start /wait msiexec /i https://nodejs.org/dist/v14.17.6/node-v14.17.6-x64.msi /qn
)

REM Esegui npm install per scaricare le dipendenze
echo Esecuzione di 'npm install'...
npm install

echo Script completato.
pause