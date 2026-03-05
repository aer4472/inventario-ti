@echo off
title Inventario TI
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  ERRO: Node.js nao encontrado. Baixe em https://nodejs.org
    pause & exit /b 1
)

if not exist "node_modules\electron\dist\electron.exe" (
    echo  Instalando dependencias (primeira vez, pode demorar ~2 minutos)...
    call npm install
    if %errorlevel% neq 0 (
        echo  ERRO no npm install.
        pause & exit /b 1
    )
    echo.
)

if not exist "public\bundle.js" (
    echo  Compilando frontend...
    call npm run build
    if %errorlevel% neq 0 (
        echo  ERRO no build.
        pause & exit /b 1
    )
    echo.
)

echo  Iniciando Inventario TI...
node_modules\electron\dist\electron.exe .
