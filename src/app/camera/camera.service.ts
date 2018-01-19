import { Injectable } from "@angular/core";

import { MainService } from "../main.service";

import * as Electron from 'electron';
import { IPCEvents, IPCData } from "../electron/model/IPCEvents";
import { Vector3 } from "three";

declare const app: typeof Electron;

@Injectable()
export class CameraService {

    constructor(
        private mainService: MainService
    ) {
    }

    sendToNewWindow(points: Vector3[]) {
        let pointcloud = this.vector3ToPoints(points);
        app.ipcRenderer.send(IPCEvents.SEND_POINTS_TO_NEW_WINDOW, {points: pointcloud});
    }

    private vector3ToPoints(points: Vector3[]): number[][] {
        let res = [];
        for(let point of points) {
            let row = [point.x, point.y, point.z]; 
            res.push(row);
        }
        return res;
    }

}