import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as _dat from 'dat-gui';

let dat: typeof _dat = require('dat.gui/build/dat.gui.js');

@Injectable()
export class MainService {

    points: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);

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