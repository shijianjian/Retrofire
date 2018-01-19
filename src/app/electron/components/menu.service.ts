import { Injectable } from "@angular/core";
import { OpenDialogOptions } from "electron";

import * as Electron from 'electron';
import { FileHelperService } from "../helpers/file-helper.service";
import { IPCData, IPCEvents } from "../model/IPCEvents";
declare const app: typeof Electron;
declare var __process: NodeJS.Process;

@Injectable()
export class MenuService {

    constructor(private fileHelperService: FileHelperService){}
    private menu: Electron.Menu;

    private openFileDialog() {
        let options: OpenDialogOptions = {
            title: 'Import a file',
            filters: this.fileHelperService.fileFilters
        };
        app.remote.dialog.showOpenDialog(options, (cb)=> {
            console.log(cb);
            this.fileHelperService.readFile(cb[0]);
        });
    }

    private menuItemsFile: Electron.MenuItemConstructorOptions = {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator:'CmdOrCtrl+O',
                click: () => {
                    this.openFileDialog();
                }
            },
            { type: 'separator' },
            {
                label: "New Tab",
                click: () => {
                    this.addTabWindow();
                },
                accelerator: "CommandOrControl+T",
            }
        ]
    };

    createMenu() {
        let template: Electron.MenuItemConstructorOptions[] = [
            this.menuItemsFile,
            {
                label: 'Edit',
                submenu: [
                    {role: 'undo'},
                    {role: 'redo'},
                    {type: 'separator'},
                    {role: 'cut'},
                    {role: 'copy'},
                    {role: 'paste'},
                    {role: 'pasteandmatchstyle'},
                    {role: 'delete'},
                    {role: 'selectall'}
                ]
            },
            {
                label: 'View',
                submenu: [
                    {role: 'reload'},
                    {role: 'forcereload'},
                    {role: 'toggledevtools'},
                    {type: 'separator'},
                    {type: 'separator'},
                    {role: 'resetzoom'},
                    {role: 'zoomin'},
                    {role: 'zoomout'},
                    {type: 'separator'},
                    {role: 'togglefullscreen'}
                ]
            },
            {
                role: 'window',
                submenu: [
                    {role: 'minimize'},
                    {role: 'close'}
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click: () => {
                            require('electron').shell.openExternal('https://www.google.com');
                        }
                    }
                ]
            }
        ];

        if (__process.platform === 'darwin') {
            template.unshift(
                {
                    label: app.remote.app.getName(),
                    submenu: [
                        {role: 'about'},
                        {type: 'separator'},
                        {role: 'services', submenu: []},
                        {type: 'separator'},
                        {role: 'hide'},
                        {role: 'hideothers'},
                        {role: 'unhide'},
                        {type: 'separator'},
                        {role: 'quit'}
                    ]
                }
            )

            // Window menu
            template[this.queryIndexOfLabelOrRoleInTemplate(template, null,"window")].submenu = [
                {role: 'close'},
                {role: 'minimize'},
                {role: 'zoom'},
                {type: 'separator'},
                {role: 'front'}
            ]
        };

        const menu = app.remote.Menu.buildFromTemplate(template);
        app.remote.Menu.setApplicationMenu(menu);
    }

    public addTabWindow(): void {
        const focusedWindow = app.remote.BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
            focusedWindow.toggleTabBar();
            focusedWindow.addTabbedWindow(this.createWindow());
        } else {
            console.log("No mainWindow")
            // mainWindow = createWindow()
        }
    }

    private createWindow(): Electron.BrowserWindow {
        const size = app.remote.screen.getPrimaryDisplay().workAreaSize;
        // and load the index.html of the app.
        let win = new app.remote.BrowserWindow({
            x: 0,
            y: 0,
            width: size.width, 
            height: size.height,
            backgroundColor: "#000000",
            icon: `file://${__process.env.PWD}/dist/assets/logo.png`,
            tabbingIdentifier: ""
        });
        win.webContents.openDevTools();
        win.loadURL(`file://${__process.env.PWD}/dist/index.html`);
        // temporary work around, menu would be destoried when closing the last tab
        // rebuilt it here.
        win.on("close", () => {
            this.createMenu();
        });
        return win;
    }

    private queryIndexOfLabelOrRoleInTemplate(template: Electron.MenuItemConstructorOptions[], label?: string, role?: string): number {
        for(let tmp in template) {
            if (template[tmp].label === label
                || template[tmp].role === role
                ) {
                return Number(tmp);
            }
        }
    }

}