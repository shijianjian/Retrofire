import { Injectable } from "@angular/core";

import * as Electron from 'electron';
declare const app: typeof Electron;

import { FileHelperService } from "./helpers/file-helper.service";
import { MainService } from "../main.service";
import { IPCData } from "./model/IPCEvents";

@Injectable() 
export class ElectronService {
  
    constructor(
        private fileHelperService: FileHelperService,
        private mainService: MainService
    ){
        app.ipcRenderer.on('load-file', (event, path) => {
            this.fileHelperService.readFile(path);
        });
        app.ipcRenderer.on('store-data', (event, data: IPCData) => {
            this.mainService.points.next({points: data.points});
        });
        app.ipcRenderer.on('get-file-content', (event) => {
            app.ipcRenderer.send('get-file-content-cb', this.mainService.points.getValue());
        });
    }

}