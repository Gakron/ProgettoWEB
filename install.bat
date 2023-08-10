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



msiexec /i "MsSqlCmdLnUtils.msi" /qn TARGETDIR="%~dp0

echo SQLCMD installato.

:: ...
