/**
 * INVENTARIO TI — Electron Main Process
 * Abre o app como janela nativa, sem precisar de navegador.
 * Eduardo Solucoes Tecnologicas — Todos os direitos reservados.
 */

const { app, BrowserWindow, Tray, Menu, shell, dialog, nativeImage } = require('electron');
const path  = require('path');
const http  = require('http');

// Inicia o servidor Express em background
require('./server.js');

const PORT = 3001;
let mainWindow = null;
let tray = null;

// Aguarda o servidor ficar pronto antes de abrir a janela
function waitForServer(callback, attempts = 0) {
  if (attempts > 30) {
    dialog.showErrorBox('Erro', 'Servidor nao iniciou. Tente novamente.');
    app.quit();
    return;
  }
  http.get('http://127.0.0.1:' + PORT, () => {
    callback();
  }).on('error', () => {
    setTimeout(() => waitForServer(callback, attempts + 1), 300);
  });
}

function createWindow() {
  const iconPath = path.join(__dirname, 'icone.ico');

  mainWindow = new BrowserWindow({
    width:           1280,
    height:          800,
    minWidth:        900,
    minHeight:       600,
    title:           'Inventario TI — Eduardo Solucoes Tecnologicas',
    icon:            iconPath,
    backgroundColor: '#070b14',
    show:            false,   // mostra so depois de carregar
    autoHideMenuBar: true,    // sem barra de menus
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Remove menu nativo (F11 ainda funciona para fullscreen)
  mainWindow.setMenu(null);

  mainWindow.loadURL('http://127.0.0.1:' + PORT);

  // Mostra a janela assim que terminar de carregar
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Minimiza para bandeja ao fechar (em vez de sair)
  mainWindow.on('close', (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  // Links externos abrem no navegador do sistema
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createTray() {
  try {
    tray = new Tray(path.join(__dirname, 'icone.ico'));
  } catch {
    tray = new Tray(nativeImage.createEmpty());
  }

  tray.setToolTip('Inventario TI — Eduardo Solucoes Tecnologicas');

  const menu = Menu.buildFromTemplate([
    {
      label: 'Abrir Inventario TI',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    { type: 'separator' },
    {
      label: 'Sobre',
      click: () => {
        dialog.showMessageBox({
          type:    'info',
          title:   'Sobre',
          message: 'Inventario TI v1.0.0',
          detail:  'Eduardo Solucoes Tecnologicas\nTodos os direitos reservados.\n\nServidor: http://localhost:' + PORT,
          icon:    path.join(__dirname, 'icone.ico'),
          buttons: ['OK']
        });
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(menu);

  // Clique na bandeja reabre a janela
  tray.on('click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

// ── INICIAR ───────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  // Splash de carregamento enquanto o servidor sobe
  let splash = new BrowserWindow({
    width:           340,
    height:          200,
    frame:           false,
    transparent:     true,
    alwaysOnTop:     true,
    backgroundColor: '#070b14',
    icon:            path.join(__dirname, 'icone.ico'),
  });

  splash.loadURL('data:text/html,' + encodeURIComponent(`
    <html>
    <body style="margin:0;background:#070b14;display:flex;flex-direction:column;
                 align-items:center;justify-content:center;height:100vh;
                 font-family:system-ui,sans-serif;border-radius:12px;">
      <img src="file://${path.join(__dirname,'icone.ico').replace(/\\/g,'/')}" 
           width="64" height="64" style="margin-bottom:16px;border-radius:12px;"
           onerror="this.style.display='none'">
      <div style="color:#fff;font-size:15px;font-weight:700;margin-bottom:6px;">Inventario TI</div>
      <div style="color:#4d6080;font-size:11px;margin-bottom:20px;">Eduardo Solucoes Tecnologicas</div>
      <div style="width:36px;height:36px;border:3px solid #172033;border-top-color:#2563eb;
                  border-radius:50%;animation:s .8s linear infinite;"></div>
      <style>@keyframes s{to{transform:rotate(360deg)}}</style>
    </body></html>
  `));

  waitForServer(() => {
    createWindow();
    createTray();
    splash.destroy();
  });
});

app.on('window-all-closed', (e) => {
  // Nao fecha o app quando janela e fechada — fica na bandeja
  e.preventDefault();
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});
