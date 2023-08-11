@echo off

REM Verifica se Node.js è già installato
node -v >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js è già installato.
) else (
    echo Installazione di Node.js...
    start /wait msiexec /i node-v18.17.1-x64.msi /quiet
)

REM Verifica se l'installazione è andata a buon fine
node -v >nul 2>&1
if %errorlevel% equ 0 (
    echo Installazione di Node.js completata.
) else (
    echo Si è verificato un problema durante l'installazione di Node.js.
    pause
    exit /b 1
)

REM Installa le dipendenze Node.js
echo Installazione delle dipendenze Node.js...
npm install

REM Verifica se l'installazione delle dipendenze è andata a buon fine
if %errorlevel% equ 0 (
    echo Installazione delle dipendenze completata.
) else (
    echo Si è verificato un problema durante l'installazione delle dipendenze Node.js.
    pause
    exit /b 1
)

REM Attendi alcuni secondi per permettere al server di avviarsi completamente
echo Attendi che il server si avvii...
timeout /t 10 /nobreak >nul

echo Avvio completato. Premi un tasto per chiudere lo script.
pause
pause
