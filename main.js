// Proyector Bíblico — aplicación de escritorio (Electron)
// Funciona sin internet: la Biblia, las fotos y las tipografías van dentro de app/index.html
const { app, BrowserWindow, screen, shell, Menu, session } = require("electron");
const path = require("path");

const PROJECTOR_NAME = "proyectorBiblicoLive";
let mainWindow = null;

// Seguridad: la app solo muestra su propio contenido local.
// Permisos que la página puede usar; todo lo demás (cámara, micrófono, ubicación, notificaciones…) se niega.
const ALLOWED_PERMISSIONS = new Set(["fullscreen", "clipboard-sanitized-write"]);

// Seguridad para TODAS las ventanas (incluida la de proyección):
// sin <webview>, sin abrir ventanas nuevas y sin navegar fuera de los archivos de la app.
app.on("web-contents-created", (_event, contents) => {
  contents.on("will-attach-webview", (e) => e.preventDefault());
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
  contents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file://")) e.preventDefault();
  });
});

// Una sola instancia abierta a la vez
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Busca la segunda pantalla (proyector / TV); si no hay, devuelve null
function externalDisplay() {
  const primary = screen.getPrimaryDisplay();
  return screen.getAllDisplays().find((d) => d.id !== primary.id) || null;
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 640,
    title: "Proyector Bíblico",
    backgroundColor: "#f5f5f7",
    autoHideMenuBar: true,
    icon: path.join(__dirname, "build", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "app", "index.html"));

  // Ventana de proyección: se abre en la segunda pantalla y a pantalla completa
  mainWindow.webContents.setWindowOpenHandler(({ url, frameName }) => {
    if (frameName === PROJECTOR_NAME || url === "about:blank" || url === "") {
      const ext = externalDisplay();
      const b = ext ? ext.bounds : { x: undefined, y: undefined, width: 1280, height: 720 };
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height,
          fullscreen: !!ext,
          backgroundColor: "#000000",
          autoHideMenuBar: true,
          title: "Proyector Bíblico — En vivo",
          icon: path.join(__dirname, "build", "icon.png"),
          webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
        },
      };
    }
    // Cualquier enlace externo se abre en el navegador del sistema
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  // Evitar que la ventana principal navegue fuera de la app
  mainWindow.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("file://")) {
      e.preventDefault();
      if (/^https?:/i.test(url)) shell.openExternal(url);
    }
  });

  // Al cerrar la ventana principal se cierra también la de proyección
  mainWindow.on("closed", () => {
    mainWindow = null;
    BrowserWindow.getAllWindows().forEach((w) => w.close());
  });
}

function buildMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    ...(isMac ? [{ role: "appMenu" }] : []),
    { role: "editMenu" },
    {
      label: "Ver",
      submenu: [
        { role: "reload", label: "Recargar" },
        { role: "togglefullscreen", label: "Pantalla completa" },
        { type: "separator" },
        { role: "resetZoom", label: "Tamaño real" },
        { role: "zoomIn", label: "Acercar" },
        { role: "zoomOut", label: "Alejar" },
      ],
    },
    { role: "windowMenu", label: "Ventana" },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) =>
    callback(ALLOWED_PERMISSIONS.has(permission))
  );
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => ALLOWED_PERMISSIONS.has(permission));
  buildMenu();
  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
