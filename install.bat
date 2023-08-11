@echo off

REM Verifica se Node.js è già installato
node -v >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js è già installato.
) else (
    echo Installazione di Node.js...
    start /wait msiexec /i node-v18.17.1-x64.msi /quiet
)

timeout /t 10 /nobreak >nul
cmd /c
echo Installazione di Node.js completata.

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



echo Completato. Premi un tasto per chiudere lo script.
pause

