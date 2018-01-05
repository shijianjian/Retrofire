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
        } else {
            this.mode.next(PointerMode.POINT);
        }
    }

    getPointerMode() {
        return this.mode;
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