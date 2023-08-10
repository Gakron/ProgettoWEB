

REM Verifica se SQL Server Express è già installato
sqllocaldb i MSSQLLocalDB
if %errorlevel% neq 0 (
    REM Installa SQL Server Express
    echo Installazione SQL Server Express in corso...
    
    SQL2022-SSEI-Expr.exe /q /Action=Install /Features=SQL /InstanceName=MSSQLLocalDB /SqlSysAdminAccounts=yourUsername /IAcceptSqlServerLicenseTerms
) else (
    echo SQL Server Express è già installato.
)

REM Crea il database da backup
echo Creazione del database da backup in corso...
sqllocaldb create MyDatabase
sqlcmd -S (localdb)\MSSQLLocalDB -d MyDatabase -i backup.sql

echo Installazione completata.
pause


REM Installa le dipendenze dell'app
npm install

REM Avvia l'applicazione Node.js
node app/server.js