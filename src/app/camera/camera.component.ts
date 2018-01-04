import { Component, ViewChild, ElementRef, HostListener, Input } from '@angular/core';

import * as _THREE from 'three';
declare const THREE: typeof _THREE;
import "three/examples/js/controls/OrbitControls";

import { MainService } from '../main.service';
import { CameraParams, PointCloudLoader } from './PointCloud';

@Component({
	selector: 'pl-camera',
	template: `
		<canvas #canvas style="width: 100%; height: 100%;"></canvas>
	`,
	styles:[`
		:host {
			display: block;
			width: 100%;
			height: 100%;
		}
	`]
})
export class CameraComponent {

	@Input() data: number[][];

	renderer: THREE.WebGLRenderer;
    figure: THREE.Points;
    controls: THREE.OrbitControls;
    camera: THREE.PerspectiveCamera;
    scene : THREE.Scene;

	@ViewChild('canvas', { read: ElementRef })
	private canvasRef: ElementRef;

	constructor(private mainService: MainService) {
		this.mainService.points.subscribe(data => {
			this.data = data;
			if (this.data && this.data.length > 0) {
				this.update();
			}
		});
	}

	/* LIFECYCLE */
	update() {
		if (!this.scene) {
			this.createScene();
			this.createLight();
		}
		if (!this.renderer) {
			this.initRenderer();
		}
		if(this.data && this.data.length > 0) {
			let cameraParams = PointCloudLoader.calculate(this.data);
			this.createCamera(this.data, cameraParams);
			this.loadPoints(this.data);
			this.addControls(cameraParams);
		}
	}

	public loadPoints(data: number[][]): void {
		let geometry = PointCloudLoader.getPointsGeometry(data);
		let figure = PointCloudLoader.loadPoints(geometry, {
			size: 0.005,
			vertexColors: THREE.VertexColors
		});
		this.figure = figure;
		this.scene.add(figure);
    }

	private createScene() {
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AxisHelper(200));
	}
	
	private createLight() {
        let light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 0, 100);
        this.scene.add(light);

        light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 0, -100);
        this.scene.add(light);
	}
	
	private createCamera(data: number[][], cameraParams: CameraParams) {
		this.camera = PointCloudLoader.buildCamera(this.canvas, cameraParams);
	}

	private initRenderer() {
        this.renderer = PointCloudLoader.initRender(this.canvas);
	}
	
	public addControls(cameraParams: CameraParams) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.copy(new THREE.Vector3(
            cameraParams.look_x, 
            cameraParams.look_y, 
			cameraParams.look_z)
		);
        this.controls.addEventListener('change', (event) => this.render(this.scene, this.camera));
	}
	
	private get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}

	private animate(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        requestAnimationFrame(() => this.animate);

        let light = new THREE.AmbientLight(0xFFFFFF, 1); // soft white light
        scene.add(light);

        this.render(scene, camera);
        this.controls.update();
    }

    private render(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.renderer.render(scene, camera);
	}

	private removeAll() {
        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }
        this.controls.removeEventListener('change', this.onControlChangeEvent);
        window.removeEventListener('resize', this.onWindowResizeEvent)
	}
	
	private onControlChangeEvent = (event) => {
        this.render(this.scene, this.camera);
    };

    private onWindowResizeEvent = (event) => {
        this.onWindowResize(this.camera);
	}

	private onWindowResize(camera) {
        let width = this.canvas.clientWidth;
        let height = this.canvas.clientHeight;
        if (height*2 > width) {
            height = width/2;
        } else if (width/2 > height) {
            width = height*2;
        }
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
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
}
