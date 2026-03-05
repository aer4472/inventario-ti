/**
 * INVENTARIO TI - Servidor Local
 * Node.js + Express + JSON file
 *
 * Como usar:
 *   npm install
 *   node server.js
 *   (build automatico na primeira vez)
 */

const express   = require('express');
const path      = require('path');
const fs        = require('fs');
const { execSync, spawnSync } = require('child_process');

const app      = express();
const PORT     = 3001;
const DB_FILE  = path.join(__dirname, 'inventario-dados.json');
const BUNDLE   = path.join(__dirname, 'public', 'bundle.js');

// ── AUTO-BUILD se bundle.js nao existir ──────────────────────────────────────
if (!fs.existsSync(BUNDLE)) {
  console.log('\n Compilando frontend React (primeira vez)...\n');
  try {
    const result = spawnSync(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['esbuild', 'src/App.jsx', '--bundle', '--outfile=public/bundle.js', '--jsx=automatic'],
      { cwd: __dirname, stdio: 'inherit', shell: false }
    );
    if (result.status !== 0) {
      console.error(' ERRO no build. Tente rodar manualmente: npm run build');
      process.exit(1);
    }
    console.log(' Build concluido!\n');
  } catch (e) {
    console.error(' Erro ao compilar:', e.message);
    process.exit(1);
  }
}

// ── BANCO DE DADOS (arquivo JSON) ─────────────────────────────────────────────
// Cria o arquivo de dados se nao existir
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '{}', 'utf8');
  console.log(' Arquivo de dados criado: inventario-dados.json');
}

function dbRead() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) { return {}; }
}

function dbWrite(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── API: GET /api/store/:key ──────────────────────────────────────────────────
app.get('/api/store/:key', (req, res) => {
  const db = dbRead(), key = req.params.key;
  if (!(key in db)) return res.status(404).json(null);
  res.json({ key, value: db[key] });
});

// ── API: GET /api/store?prefix=inv_ ──────────────────────────────────────────
app.get('/api/store', (req, res) => {
  const db = dbRead(), prefix = req.query.prefix || '';
  res.json({ keys: Object.keys(db).filter(k => k.startsWith(prefix)) });
});

// ── API: POST /api/store/:key  { value } ─────────────────────────────────────
app.post('/api/store/:key', (req, res) => {
  const { value } = req.body;
  if (value === undefined) return res.status(400).json({ error: 'value required' });
  const db = dbRead(), key = req.params.key;
  db[key] = value;
  dbWrite(db);
  res.json({ key, value });
});

// ── API: DELETE /api/store/:key ───────────────────────────────────────────────
app.delete('/api/store/:key', (req, res) => {
  const db = dbRead(), key = req.params.key;
  delete db[key];
  dbWrite(db);
  res.json({ key, deleted: true });
});

// ── BACKUP: GET /api/backup ───────────────────────────────────────────────────
app.get('/api/backup', (_req, res) => {
  const db = dbRead(), parsed = {};
  Object.entries(db).forEach(([k, v]) => {
    try { parsed[k] = JSON.parse(v); } catch { parsed[k] = v; }
  });
  const name = 'inventario_backup_' + new Date().toISOString().slice(0,10) + '.json';
  res.setHeader('Content-Disposition', 'attachment; filename="' + name + '"');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(JSON.stringify(parsed, null, 2));
});

// ── RESTORE: POST /api/restore ────────────────────────────────────────────────
app.post('/api/restore', (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') return res.status(400).json({ error: 'JSON invalido' });
  const db = dbRead();
  Object.entries(payload).forEach(([k, v]) => {
    db[k] = typeof v === 'string' ? v : JSON.stringify(v);
  });
  dbWrite(db);
  res.json({ restored: Object.keys(payload).length });
});

// ── FALLBACK ──────────────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── INICIAR ───────────────────────────────────────────────────────────────────
app.listen(PORT, '127.0.0.1', () => {
  const url = 'http://localhost:' + PORT;
  console.log('');
  console.log('+------------------------------------------+');
  console.log('|   Inventario TI -- rodando OFFLINE       |');
  console.log('+------------------------------------------+');
  console.log('|  Acesse : ' + url + '              |');
  console.log('|  Dados  : inventario-dados.json          |');
  console.log('|  Parar  : Ctrl + C                       |');
  console.log('+------------------------------------------+');
  console.log('');
  const { exec } = require('child_process');
  const open =
    process.platform === 'win32'  ? 'start "" "' + url + '"' :
    process.platform === 'darwin' ? 'open "' + url + '"' :
                                    'xdg-open "' + url + '"';
  // Abre navegador somente fora do Electron
  if (!process.versions.electron) {
    exec(open, err => { if (err) console.log('Abra: ' + url); });
  }
});
