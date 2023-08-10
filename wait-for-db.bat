@echo off

REM Script per attendere che il database MySQL sia pronto

set host=%1
set port=%2
set timeout=%3
setlocal enabledelayedexpansion

set start_time=!time!

for /f "tokens=1-3 delims=:." %%a in ("!time!") do (
    set /a "seconds=(((%%a*60)+1%%b %% 60)*60+1%%c %% 60)-3661"
    set end_time=!seconds!
)

:LOOP
REM Verifica se il database è pronto
powershell -command "Test-NetConnection -ComputerName %host% -Port %port%" | Select-Object TcpTestSucceeded | ForEach-Object {
    if ($_ -eq $true) (
        echo Database is ready
        exit /b 0
    )
}

REM Ottieni l'orario corrente
for /f "tokens=1-3 delims=:." %%a in ("!time!") do (
    set /a "seconds=(((%%a*60)+1%%b %% 60)*60+1%%c %% 60)-3661"
    set current_time=!seconds!
)

REM Confronta l'orario corrente con l'orario di fine
if !current_time! geq !end_time! (
    echo Timeout: Database not available
    exit /b 1
)

REM Attendi un secondo e ripeti il ciclo
ping -n 2 127.0.0.1 > nul
goto :LOOP