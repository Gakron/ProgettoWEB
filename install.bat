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

REM Verifica se MySQL è installato
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL non è installato. Verrà scaricato e installato.

    REM Installa MySQL 
    start /wait mysql-installer-web-community-8.0.34.0 (1).msi

    REM Aggiungi il percorso di MySQL all'ambiente PATH 
    setx PATH "%PATH%;C:\Program Files\MySQL\MySQL Server 8.0\bin" /M
)


REM Crea il database MySQL (assumendo che MySQL sia già installato e configurato)
mysql -u root -pciaociao19 -P 3305 -e "CREATE DATABASE IF NOT EXIST progetto;"

REM Ripristina il backup del database
mysql -u root -pciaociao19 -P 3305 progetto < backup.sql

REM Crea il file .env
copy .env.example .env

REM Modifica il file .env con le credenziali e le configurazioni appropriate
powershell -Command "(Get-Content .env) -replace 'DB_HOST=localhost', 'DB_HOST=localhost' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'DB_USER=username', 'DB_USER=root' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'DB_PASS=password', 'DB_PASS=ciaociao19' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'DB_PORT=3306', 'DB_PORT=3305' | Set-Content .env"

REM ... 
pause