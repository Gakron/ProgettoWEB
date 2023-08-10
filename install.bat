@echo off

:: Verifica se SQLLocalDB è già installato
sqllocaldb info MSSQLLocalDB > nul 2>&1
if %errorlevel% neq 0 (
    echo SQLLocalDB non è installato. Installazione in corso...
    
    :: Scarica ed installa SQLLocalDB
    :: Modifica il percorso del file di installazione di SQLLocalDB
    start /wait SQL2022-SSEI-Expr.exe
    
    echo SQLLocalDB installato.
) else (
    echo SQLLocalDB è già installato.
)


start /wait msodbcsql.msi


:: Verifica se SQLCMD è già installato
sqlcmd -? > nul 2>&1
if %errorlevel% neq 0 (
    echo SQLCMD non è installato. Installazione in corso...
    
    :: Scarica ed installa SQLCMD
    :: Modifica il percorso del file di installazione di SQLCMD
    start /wait MsSqlCmdLnUtils.msi
    
    echo SQLCMD installato.
) else (
    echo SQLCMD è già installato.
)


:: Ottieni il percorso della cartella del file batch
for %%i in ("%~dp0.") do (
    set "batch_folder=%%~fi"
)

:: Trova il percorso di sqlcmd.exe nel sistema
for /f "delims=" %%a in ('where /r C:\ sqlcmd.exe 2^>nul') do (
    set "sqlcmd_path=%%a"
    goto :sqlcmd_found
)

:sqlcmd_found
if not defined sqlcmd_path (
    echo sqlcmd.exe non trovato nel sistema.
    pause
    exit /b
)

:: Copia sqlcmd.exe nella cartella del file batch
copy /Y "%sqlcmd_path%" "%batch_folder%\sqlcmd.exe"

:: Aggiungi la cartella del file batch a PATH (assicurati che la cartella non sia già presente)
setx PATH "%batch_folder%;%PATH%"

echo sqlcmd.exe copiato e cartella aggiunta a PATH.


echo Creazione del Database Locale in corso...
:: Configurazione
set server_name=(localdb)\MSSQLLocalDB
set database_name=progetto
set backup_file=backup.sql

:: Cerca sqlcmd.exe nel percorso di sistema
for %%i in (sqlcmd.exe) do (
    set "sqlcmd_exe=%%~$PATH:i"
)

:: Controlla se sqlcmd.exe è stato trovato
if not defined sqlcmd_exe (
    echo sqlcmd.exe non trovato nel percorso di sistema.
    pause
    exit /b
)

:: Crea il database
%sqlcmd_exe% -S %server_name% -Q "CREATE DATABASE %database_name%;"

:: Ripristina il backup
%sqlcmd_exe% -S %server_name% -d %database_name% -i %backup_file%

echo Creazione completata.
pause