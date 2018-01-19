import { Injectable } from "@angular/core";
import { OpenDialogOptions } from "electron";

import * as Electron from 'electron';
import { FileHelperService } from "../helpers/file-helper.service";
import { IPCData, IPCEvents } from "../model/IPCEvents";
declare const app: typeof Electron;

@Injectable()
export class MenuService {

    constructor(private fileHelperService: FileHelperService){
        app.ipcRenderer.on('load-file', (event, path) => {
            this.fileHelperService.readFile(path);
        });
    }

}