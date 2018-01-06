import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as _dat from 'dat-gui';
import { PointerMode } from "./model/pointer.mode";

let dat: typeof _dat = require('dat.gui/build/dat.gui.js');

@Injectable()
export class MainService {

    points: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
    private mode: BehaviorSubject<PointerMode> = new BehaviorSubject<PointerMode>(PointerMode.POINT);

    setPointerMode(mode: PointerMode) {
        if (this.mode.getValue() !== mode) {
            this.mode.next(mode);
            this.updatePointerByMode(mode);
        } else {
            this.mode.next(PointerMode.POINT);
            this.updatePointerByMode(PointerMode.POINT);
        }
    }

    getPointerMode() {
        return this.mode;
    }

    private updatePointerByMode(mode: PointerMode) {
        let canvas = document.getElementById("canvas");
        if (mode === PointerMode.POINT
            || mode === PointerMode.RESIZE
        ) {
            canvas.style.cursor = 'default';
        } else if (mode === PointerMode.CROP) {
            canvas.style.cursor = 'crosshair';
        } else {
            throw new TypeError(`Mode '${mode}' not found.`);
        }
    }

    // globle shared gui settings
    private gui: dat.GUI = new dat.GUI({
        autoPlace: false
    });

    get globalGui(): dat.GUI {
        return this.gui;
    }

    resetGui(): void {
        this.gui.destroy();
        this.gui = new dat.GUI({
            autoPlace: false
        });
    }
}