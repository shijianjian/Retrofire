const { app, Menu, BrowserWindow, ipcMain } = require('electron');

const path = require('path');
const url = require('url');

const { buildMenu } = require('./settings/menu');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let windowCounter = 0;
// hot reload
require('electron-reload')(__dirname);

function createWindow() {

	const { screen } = require('electron')
	const size = screen.getPrimaryDisplay().workAreaSize;

  	// and load the index.html of the app.
  	let win = new BrowserWindow({
        x: 0,
		y: 0,
		title: "Retrofire",
        width: size.width, 
		height: size.height,
		backgroundColor: "#000000",
		icon: `file://${__dirname}/dist/assets/logo.png`,
		tabbingIdentifier: `window-${windowCounter}`
    });
    
  	win.loadURL(`file://${__dirname}/dist/index.html`);

	win.on("focus", function() {
		mainWindow = win;
	});
	windowCounter ++;
  	return win;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
	mainWindow = createWindow();
	buildMenu();
});
app.on('new-window-for-tab', function () {
  	mainWindow = createWindow();
});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		mainWindow = createWindow();
	}
});

ipcMain.on('add-new-tab', ()=> {
	let win = createWindow();
	mainWindow.addTabbedWindow(win);
	mainWindow = win;
});

ipcMain.on('open-files', (filePaths) => {
	console.log(filePaths);
	mainWindow.webContents.send('load-file', filePaths[0]);
});

// Create new tab for recieving partial point cloud
ipcMain.on('send-points-to-new-window', (event, points) => {
	let win = createWindow();
	win.webContents.once('did-finish-load', () => {
		win.webContents.send('store-data', points);
	});
	mainWindow.addTabbedWindow(win);
})