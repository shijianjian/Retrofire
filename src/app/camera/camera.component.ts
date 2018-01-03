import { Component, ViewChild, ElementRef, HostListener, Input } from '@angular/core';

import * as THREE from 'three';
import "three/examples/js/controls/OrbitControls";
import { MainService } from '../main.service';

@Component({
	selector: 'pl-camera',
	templateUrl: './camera.component.html'
})
export class CameraComponent {

	@Input() data: number[][];

	renderer: THREE.WebGLRenderer;
    figure: THREE.Points | THREE.Mesh[];
    // controls: THREE.OrbitControls;
    camera: THREE.PerspectiveCamera;
    scene : THREE.Scene;

	@ViewChild('canvas')
	private canvasRef: ElementRef;

	constructor(private mainService: MainService) {
		this.mainService.points.subscribe(data => {
			console.log(data)
			this.data = data;
		});
	}

	private get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}



	/* EVENTS */

	@HostListener('window:resize', ['$event'])
	public onResize(event: Event) {
		// this.canvas.style.width = "100%";
		// this.canvas.style.height = "100%";
		// console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

		// this.camera.aspect = this.getAspectRatio();
		// this.camera.updateProjectionMatrix();
		// this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
		// this.render();
	}

	@HostListener('document:keypress', ['$event'])
	public onKeyPress(event: KeyboardEvent) {
		console.log("onKeyPress: " + event.key);
	}

	/* LIFECYCLE */
	ngAfterViewInit() {
		// this.createScene();
		// this.createLight();
		// this.createCamera();
		// this.startRendering();
		// this.addControls();
	}
}
