const { app, Menu, BrowserWindow } = require('electron');

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// hot reload
require('electron-reload')(__dirname);


function createWindow() {

	const { screen } = require('electron')
	const size = screen.getPrimaryDisplay().workAreaSize;

  	// and load the index.html of the app.
  	win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width, 
        height: size.height,
		icon: `file://${__dirname}/dist/assets/logo.png`,
		tabbingIdentifier: "window"
    });
    
  	win.loadURL(`file://${__dirname}/dist/index.html`);

	win.on("close", function() {
		if (win === mainWindow) {
			mainWindow = null
		}
	});

  	return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  	mainWindow = createWindow();
});
app.on('new-window-for-tab', function () {
  	createWindow();
});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
});
app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		mainWindow = createWindow()
	}
});