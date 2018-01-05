import { Injectable } from "@angular/core";
import * as _dat from 'dat-gui';

let dat: typeof _dat = require('dat.gui/build/dat.gui.js');

import { MainService } from "../main.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class CameraGuiService {

    private pointParameters: PointGuiControls = {
        size: 0.01,
        opacity: 1,
        colour: '#ff7d00'
    };

    private sceneParameters: SceneGuiControls = {
        colour: '#303030',
        axes: false
    }

    pointControls = new BehaviorSubject<PointUpdate>({control: undefined, parameters: this.pointParameters});
    sceneControls = new BehaviorSubject<SceneUpdate>({control: undefined, parameters: this.sceneParameters});

    private gui: dat.GUI;

    private sceneBackground: dat.GUIController;
    private sceneAxes: dat.GUIController;
    
    private pointSize: dat.GUIController;
    private pointColour: dat.GUIController;
    private pointOpacity: dat.GUIController;

    constructor(private mainService: MainService) {
        
    }

    buildGuiIfNotExits() {
        const domElementId: string = "body";
        if (document.getElementById(domElementId) != null
            && document.getElementById("dat-gui-main") == null) 
        {
            this.initGui();
            this.initControls();
            this.gui.open();
            this.gui.domElement.style.position = "absolute";
            this.gui.domElement.style.top = "0";
            this.gui.domElement.style.right = "0";
            this.gui.domElement.id = "dat-gui-main";
            document.getElementById(domElementId).style.position = "relative";
            document.getElementById(domElementId).appendChild(this.gui.domElement);
        }
    }

    private initGui() {
        this.gui = this.mainService.globalGui;
        // Scene
        let sceneSettings = this.gui.addFolder("Scene Settings");
        this.sceneBackground = sceneSettings
            .addColor(this.sceneParameters, SceneControls.COLOUR)
            .name('Colour').listen();
        this.sceneAxes = sceneSettings
            .add(this.sceneParameters, SceneControls.AXES)
            .name('Axes').listen();
        // Points
        let pointSettings = this.gui.addFolder("Points Settings");
        this.pointSize = pointSettings
            .add(this.pointParameters, PointControls.SIZE)
            .min(0.001).max(0.1).step(0.001).name("Size").listen();
        this.pointColour = pointSettings
            .addColor(this.pointParameters, PointControls.COLOUR)
            .name('Colour').listen();
        this.pointOpacity = pointSettings
            .add(this.pointParameters, PointControls.OPACITY)
            .min(0.1).max(1).step(0.1).name('Opacity').listen();
    }

    private initControls() {
        // Scene
        this.sceneBackground.onChange((value) => {
            this.sceneParameters.colour = value;
            this.sceneControls.next({control: SceneControls.COLOUR, parameters: this.sceneParameters});
        });
        this.sceneAxes.onChange((value) => {
            this.sceneParameters.axes = value;
            this.sceneControls.next({control: SceneControls.AXES, parameters: this.sceneParameters});
        });

        // Points
        this.pointSize.onChange((value) => {
            this.pointParameters.size = value;
            this.pointControls.next({control: PointControls.SIZE, parameters: this.pointParameters});
        });
        this.pointColour.onChange((value) => {
            this.pointParameters.colour = value;
            this.pointControls.next({control: PointControls.COLOUR, parameters: this.pointParameters});
        });
        this.pointOpacity.onChange((value) => {
            this.pointParameters.opacity = value;
            this.pointControls.next({control: PointControls.OPACITY, parameters: this.pointParameters});
        });
    }

}

export enum SceneControls {
    COLOUR='colour',
    AXES='axes'
}

export interface SceneGuiControls {
    colour: string;
    axes: boolean;
}

export interface SceneUpdate {
    control: SceneControls,
    parameters: SceneGuiControls
}

export enum PointControls {
    SIZE='size',
    OPACITY='opacity',
    COLOUR='colour'
}

export interface PointGuiControls {
    size: number,
    opacity: number,
    colour: string
}

export interface PointUpdate {
    control: PointControls,
    parameters: PointGuiControls
}
