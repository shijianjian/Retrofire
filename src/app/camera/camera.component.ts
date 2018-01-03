import { Component, ViewChild, ElementRef } from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'pl-camera',
  templateUrl: './camera.component.html'
})
export class CameraComponent {

    @ViewChild('canvas')    private canvasRef: ElementRef;
    @ViewChild('container') private containerRef: ElementRef;
    
    constructor() {
        
    }

}
