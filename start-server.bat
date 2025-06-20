@echo off
echo 🚀 Iniciando servidor Orbis Webhook...
echo.

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado! Por favor instale o Node.js primeiro.
    echo 📥 Download: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!

REM Verificar se as dependências estão instaladas
if not exist node_modules (
    echo 📦 Instalando dependências...
    npm install --package-lock-only=false express cors ws
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas!
)

echo.
echo 🎯 Iniciando servidor na porta 3001...
echo 💡 O webhook estará disponível em: http://localhost:3001/api/webhook/tasks
echo 🔗 Pressione Ctrl+C para parar o servidor
echo.

REM Iniciar o servidor
node server.js

pause 