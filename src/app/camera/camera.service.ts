import { Injectable } from "@angular/core";

import { MainService } from "../main.service";

import * as Electron from 'electron';
import { IPCEvents, IPCData } from "../electron/model/IPCEvents";
declare const app: typeof Electron;

@Injectable()
export class CameraService {

    constructor(
        private mainService: MainService
    ) {
    }

    sendToNewWindow(points) {
        app.ipcRenderer.send(IPCEvents.SEND_POINTS_TO_NEW_WINDOW, {points: points});
    }

}