# Inventario TI — Setup

## Estrutura de pastas

```
inventario-ti/
  server.js          <- backend Node.js
  package.json       <- dependencias
  inventario.db      <- banco SQLite (criado automaticamente)
  src/
    App.jsx          <- frontend React (it-inventory-v5.jsx renomeado)
  public/
    index.html       <- pagina HTML
    bundle.js        <- gerado pelo build
```

## Como instalar e rodar

### Requisitos
- Node.js 18+ (https://nodejs.org)

### Passos

1. Crie a pasta `inventario-ti` e coloque os arquivos:
   - `server.js`
   - `package.json`
   - `public/index.html`
   - `src/App.jsx`  (copie o conteudo de it-inventory-v5.jsx)

2. Abra o terminal na pasta e rode:

```bash
# Instalar dependencias (so precisa fazer 1 vez)
npm install

# Compilar o React para bundle.js
npm run build

# Iniciar o servidor
npm start
```

3. O browser abre automaticamente em http://localhost:3001

### Para usar todo dia

Basta rodar `npm start` dentro da pasta.
No Windows, voce pode criar um arquivo `iniciar.bat`:

```bat
@echo off
cd /d "%~dp0"
npm start
pause
```

Dois cliques e pronto.

## Backup dos dados

Acesse http://localhost:3001/api/backup para baixar todos os dados em JSON.

Para restaurar, envie um POST para /api/restore com o JSON no body.

## Dados

Os dados ficam no arquivo `inventario.db` (SQLite).
Faca backup desse arquivo para nao perder nada.
