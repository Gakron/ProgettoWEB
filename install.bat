@echo off

REM Verifica se SQL Server Express è già installato
sqllocaldb i MSSQLLocalDB
if %errorlevel% neq 0 (
    REM Installa SQL Server Express
    echo Installazione SQL Server Express in corso...
    SQL2022-SSEI-Expr.exe /q /Action=Install /Features=SQL /InstanceName=MSSQLLocalDB /SqlSysAdminAccounts=yourUsername /IAcceptSqlServerLicenseTerms
) else (
    echo SQL Server Express è già installato.
)

REM Verifica se sqlcmd è già installato
where sqlcmd
if %errorlevel% neq 0 (
    REM Installa sqlcmd
    echo Installazione sqlcmd in corso...
    MsSqlCmdLnUtils.msi /q   
) else (
    echo sqlcmd è già installato.
)

