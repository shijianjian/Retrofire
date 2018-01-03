const { app, BrowserWindow } = require('electron')

let win;

// hot reload
require('electron-reload')(__dirname);

function createWindow () {

  const { screen } = require('electron')
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width, 
    height: size.height,
    // backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`
  })

  win.loadURL(`file://${__dirname}/dist/index.html`)

  // To open the DevTools.
  win.webContents.openDevTools();

  // Event when the window is closed.
  win.on('closed', function () {
    win = null;
  });
}

// Create window on electron intialization
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});
