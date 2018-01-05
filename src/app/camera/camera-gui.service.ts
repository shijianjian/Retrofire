import { Injectable } from "@angular/core";
import * as _dat from 'dat-gui';

let dat: typeof _dat = require('dat.gui/build/dat.gui.js');

import { MainService } from "../main.service";

@Injectable()
export class CameraGuiService {

    gui: dat.GUI;

    private parameters = {
        size: 0.01,
        opacity: 1
    };

    private figureSize;
    private figureMaterial;
    private figureOpacity;

    constructor(private mainService: MainService) {
        
    }

    buildGui() {
        this.gui = this.mainService.globalGui;
        let pointSettings = this.gui.addFolder("Points Settings");
        this.figureSize = pointSettings
            .add(this.parameters, 'size')
            .min(0.001).max(1).step(0.001).name("Point Size").listen();
        this.figureOpacity = pointSettings
            .add(this.parameters, 'opacity')
            .min(0.1).max(1).step(0.1).name('Opacity').listen();

        this.initControl("body");
    }

    private initControl(domElementId: string) {
        // this.figureSize.onChange((value) => {
        //     this.parameters.size = value;
        //     this._controllers.next(this.parameters);
        // });
        // this.figureMaterial.onChange((value) => {
        //     this.parameters.wireframe = value;
        //     this._controllers.next(this.parameters);
        // });
        // this.figureOpacity.onChange((value) => {
        //     this.parameters.opacity = value;
        //     this._controllers.next(this.parameters);
        // });
        setTimeout(() => {
            this.gui.close();
            this.gui.domElement.style.position = "absolute";
            this.gui.domElement.style.top = "0";
            this.gui.domElement.style.right = "0";
            if (document.getElementById(domElementId) != null) {
                document.getElementById(domElementId).style.position = "relative";
                document.getElementById(domElementId).appendChild(this.gui.domElement);
            }
        })
    }

}