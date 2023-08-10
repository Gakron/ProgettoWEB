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


:: Verifica se msodbcsql.msi è già installato
wmic product where "Name like 'ODBC Driver%'" get Name > nul 2>&1
if %errorlevel% neq 0 (
    echo msodbcsql.msi non è installato. Installazione in corso...
    
    :: Scarica ed installa msodbcsql.msi
    :: Modifica il percorso del file di installazione di msodbcsql.msi
    start /wait msodbcsql.msi
    
    echo msodbcsql.msi installato.
) else (
    echo msodbcsql.msi è già installato.
)

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

echo Creazione del Database Locale in corso...

:: Configurazione
set server_name=(localdb)\MSSQLLocalDB
set database_name=progetto
set backup_file=backup.sql

:: Trova la directory System32
for %%i in ("%SYSTEMROOT%\System32\sqlcmd.exe") do (
    set sqlcmd_exe=%%~dpi
)

:: Aggiungi la directory di SQLCMD al percorso di sistema
set PATH=%sqlcmd_dir%;%PATH%

:: Crea il database
%sqlcmd_exe%sqlcmd.exe -S %server_name% -Q "CREATE DATABASE %database_name%;"

:: Ripristina il backup
%sqlcmd_exe%sqlcmd.exe -S %server_name% -d %database_name% -i %backup_file%

echo Creazione completata.
pause