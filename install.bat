@echo off

REM Verifica se Node.js è già installato
node -v >nul 2>&1
if %errorlevel% equ 0 (
    echo Node.js è già installato.
) else (
    start /wait node-v18.17.1-x64.msi
)

REM Installa le dipendenze Node.js
npm install

pause



REM Attendi alcuni secondi per permettere al server di avviarsi completamente
timeout /t 10 /nobreak >nul

pause
