@echo off
echo Installazione del Database Locale in corso...

:: Configurazione
set mysql_user=root
set mysql_password=ciaociao19
set database_name=progetto
set backup_file=backup.sql

:: Verifica se MySQL è installato
where mysql > nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL non è installato. Installazione in corso...
    
    :: Esegui l'installer
    mysql-installer-web-community-8.0.34.0.msi
)

:: Crea il database
mysql -u %mysql_user% -p%mysql_password% -e "CREATE DATABASE %database_name%;"

:: Ripristina il backup
mysql -u %mysql_user% -p%mysql_password% %database_name% < %backup_file%

echo Installazione completata.
pause