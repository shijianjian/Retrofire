import { Component, ViewChild, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { PointsMaterial } from 'three';
import * as _THREE from 'three';
declare const THREE: typeof _THREE;
import "three/examples/js/controls/OrbitControls";

import { MainService } from '../main.service';
import { CameraParams, PointCloudLoader } from './PointCloud';
import { CameraGuiService, PointControls, SceneControls, SceneGuiControls } from './camera-gui.service';
import { PointerMode } from '../model/pointer.mode';


@Component({
	selector: 'pl-camera',
	template: `
		<canvas #canvas id="canvas" style="width: 100%; height: 100%;" plSceneSelection></canvas>
	`,
	styles:[`
		:host {
			display: block;
			width: 100%;
			height: 100%;
		}
	`]
})
export class CameraComponent implements OnInit, OnDestroy {

	@Input() data: number[][];

	renderer: THREE.WebGLRenderer;
    figure: THREE.Points;
    controls: THREE.OrbitControls;
    camera: THREE.PerspectiveCamera;
    scene : THREE.Scene;

	@ViewChild('canvas', { read: ElementRef })
	private canvasRef: ElementRef;

	private axisHelper: THREE.AxisHelper;
	
	constructor(
		private mainService: MainService,
		private cameraGuiService: CameraGuiService
	) {
		this.mainService.points.subscribe(data => {
			this.data = data;
			if (this.data && this.data.length > 0) {
				this.update();
				this.mainService.setPointerMode(PointerMode.POINT);
			}
		});
		this.mainService.getPointerMode().subscribe(mode => {
			if (typeof this.controls == 'undefined') {
				return;
			}
			if (mode == PointerMode.POINT) {
				this.controls.enabled = true;
			}
			if (mode == PointerMode.CROP) {
				this.controls.enabled = false;
			}
		});
		this.cameraGuiService.pointControls.subscribe(ctrls => {
			if (this.figure) {
				ctrls.control === PointControls.SIZE ? 
					(<PointsMaterial>this.figure.material).size = ctrls.parameters.size : null;
				ctrls.control === PointControls.OPACITY ? 
					(<PointsMaterial>this.figure.material).opacity = ctrls.parameters.opacity : null;
				ctrls.control === PointControls.COLOUR ? 
					(<PointsMaterial>this.figure.material).color = new THREE.Color(ctrls.parameters.colour) : null;
				
				this.render();
			}	
		});
		this.cameraGuiService.sceneControls.subscribe(ctrls => {
			if(this.scene) {
				ctrls.control === SceneControls.COLOUR ?
					this.scene.background = new THREE.Color(ctrls.parameters.colour) : null;

				// axes
				if (ctrls.control === SceneControls.AXES) {
					if (typeof this.axisHelper == 'undefined') {
						this.axisHelper = new THREE.AxisHelper();
					}
					if (ctrls.parameters.axes) {
						this.scene.add(this.axisHelper);
					} else {
						this.scene.remove(this.axisHelper);
					}
				}
				
				this.render();
			}
		});
	}


	ngOnInit() {
		this.createScene(this.cameraGuiService.sceneControls.getValue().parameters);
		this.createLight();
		this.initRenderer();
	}

	/* LIFECYCLE */
	update() {
		if(this.data && this.data.length > 0) {
			let cameraParams = PointCloudLoader.calculate(this.data);
			this.createCamera(this.data, cameraParams);
			if (this.figure) {
				this.scene.remove(this.figure);
			}
			this.loadPoints(this.data);
			if (this.controls) {
				this.controls.removeEventListener('change', this.onControlChangeEvent);
			}
			this.addControls(cameraParams);
			this.render();
			this.cameraGuiService.buildGuiIfNotExits();
		}
	}

	ngOnDestroy() {
		this.removeAll();
	}

	public loadPoints(data: number[][]): void {
		let geometry = PointCloudLoader.getPointsGeometry(data);
		let figure = PointCloudLoader.loadPoints(geometry, {
			size: this.cameraGuiService.pointControls.getValue().parameters.size,
			transparent: true, // for controlling opacity
			vertexColors: THREE.VertexColors
		});
		this.figure = figure;
		this.scene.add(figure);
    }

	private createScene(parameters: SceneGuiControls) {
		this.scene = new THREE.Scene();
		this.scene.background = parameters.colour;
        parameters.axes ? this.scene.add(new THREE.AxisHelper()) : null;
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
        this.controls.addEventListener('change', (event) => this.render());
	}
	
	private get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}

	private animate() {
        requestAnimationFrame(() => this.animate);

        this.render();
        this.controls.update();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
	}

	private removeAll() {
        while (this.scene.children.length){
            this.scene.remove(this.scene.children[0]);
        }
        this.controls.removeEventListener('change', this.onControlChangeEvent);
	}
	
	private onControlChangeEvent = (event) => {
        this.render();
    };

	/* EVENTS */

	@HostListener('window:resize', ['$event'])
	public onResize(event: Event) {
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

		if (this.camera) {
			this.camera.aspect = this.canvas.clientWidth/this.canvas.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
			this.render();
		} else {
			console.log('Camera has not been defined.');
		}
	}

	@HostListener('document:keydown', ['$event'])
	public onKeyPress(event: KeyboardEvent) {
		event.stopPropagation();
		console.log("onKeyPress: " + event.key);
		if (event.keyCode === 27) { // on Press Escape
			this.mainService.setPointerMode(PointerMode.POINT);
		}
	}
}
