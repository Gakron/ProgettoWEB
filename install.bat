@echo off
setlocal

REM Controlla se Node.js è installato
where node > nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js è già installato.
) else (
    echo Node.js non è installato nel sistema.
    set /p installNode=Desideri installare Node.js? (Y/N):
    if /i "%installNode%"=="Y" (
        REM Esegui il processo di installazione di Node.js
        REM Puoi modificare questo comando con l'installazione corretta per il tuo sistema
        REM Ad esempio, scaricare l'installer da https://nodejs.org/ e modificarlo di conseguenza
        echo Installazione di Node.js...
        start /wait msiexec /i node-v18.17.1-x64.msi /qn
    ) else (
        echo Installazione di Node.js annullata.
        exit /b
    )
)

REM Esegui npm install per scaricare le dipendenze
echo Esecuzione di 'npm install'...
npm install

echo Script completato.
pause