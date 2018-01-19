import { Component, ViewChild, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import * as _THREE from 'three';
declare const THREE: typeof _THREE;
import "three/examples/js/controls/OrbitControls";

import { MainService } from '../main.service';
import { CameraParams, PointCloudLoader } from './PointCloud';
import { CameraGuiService, PointControls, SceneControls, SceneGuiControls } from './camera-gui.service';
import { PointerMode } from '../model/pointer.mode';
import { BoundingBox } from './scene-selection.directive';
import { CameraService } from './camera.service';


@Component({
	selector: 'pl-camera',
	template: `
		<canvas 
			#canvas 
			id="canvas" 
			style="width: 100%; height: 100%;" 
			plSceneSelection
			(boundingBox)="onBoundingBox($event)"
		></canvas>
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
		private cameraService: CameraService,
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
					(<THREE.PointsMaterial>this.figure.material).size = ctrls.parameters.size : null;
				ctrls.control === PointControls.OPACITY ? 
					(<THREE.PointsMaterial>this.figure.material).opacity = ctrls.parameters.opacity : null;
				ctrls.control === PointControls.COLOUR ? 
					(<THREE.PointsMaterial>this.figure.material).color = new THREE.Color(ctrls.parameters.colour) : null;
				
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
	

	// Select Points
	private onBoundingBox(event: BoundingBox) {
		this.figure.updateMatrix();
		
		let vector: THREE.Vector3;
		let selected = (<THREE.Geometry>this.figure.geometry).vertices.filter((value) => {
			vector = value.clone();
			vector.applyMatrix4(this.figure.matrixWorld);
			let position = this.toScreenXY(vector);
			return this.pointInsideBBOX(position, event);
		});
		this.cameraService.sendToNewWindow(selected);
		console.log(selected.length)
	}

	private toScreenXY (position: THREE.Vector3) {

		let pos = position.clone();
		let projScreenMat = new THREE.Matrix4();
		projScreenMat.multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse );
		pos.applyMatrix4(projScreenMat);
  
		return new THREE.Vector3(
			( pos.x + 1 ) * this.canvas.clientWidth/ 2 + this.canvas.offsetLeft,
			( - pos.y + 1) * this.canvas.clientHeight/ 2 + this.canvas.offsetTop
		);
	}

	private pointInsideBBOX(point: THREE.Vector3, box: BoundingBox) {
		
		if (point.x >= box.left && point.x<=box.right 
			&& point.y>=box.top && point.y<=box.bottom
		) {
			return true;
		}
		return false;
	}

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
}
