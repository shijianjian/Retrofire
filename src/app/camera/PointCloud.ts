import * as _THREE from 'three';
import { Point3D } from '../electron/model/pointcloud';
declare const THREE: typeof _THREE;

export interface CameraParams {
    position_x: number;
    position_y: number;
    position_z: number;
    look_x: number;
    look_y: number;
    look_z: number;
}


interface Ranges {
    X_MAX: number;
    Y_MAX: number;
    Z_MAX: number;
    X_MIN: number;
    Y_MIN: number;
    Z_MIN: number;
}


class ThreeDLoader {

    static initRender(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
        let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer(({ 
            canvas: canvas,
            antialias: false,
            preserveDrawingBuffer: true
        } as THREE.WebGLRendererParameters));
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        return renderer;
    }

    static buildCamera(canvas: HTMLCanvasElement, cameraParams: CameraParams): THREE.PerspectiveCamera {
        let camera: THREE.PerspectiveCamera;
        camera = new THREE.PerspectiveCamera(90, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);
        camera.position.x = cameraParams.position_x;
        camera.position.y = cameraParams.position_y;
        camera.position.z = cameraParams.position_z;
        camera.up = new THREE.Vector3(0, 0, 1);

        camera.rotation.order = "YXZ";
        camera.lookAt(new THREE.Vector3(
            cameraParams.look_x, 
            cameraParams.look_y, 
            cameraParams.look_z));
        
        return camera;
    }

    static updateCamera(camera: THREE.PerspectiveCamera, cameraParams: CameraParams) {
        camera.position.set(
            cameraParams.position_x, 
            cameraParams.position_y,
            cameraParams.position_z);
        camera.lookAt(new THREE.Vector3(
            cameraParams.look_x,
            cameraParams.look_y,
            cameraParams.look_z));
        camera.updateProjectionMatrix();
        return camera;
    }
}


export class PointCloudLoader extends ThreeDLoader {

    private static cameraParams: CameraParams;
    private static ranges: Ranges;
    private static total_x = 0;
    private static total_y = 0;
    private static total_z = 0;
    private static numberOfPoints = 0;
    private geometry: THREE.Geometry = new THREE.Geometry();
    private colors: THREE.Color[] = [];

    constructor() {
        super();
    }

    static reset() {
        PointCloudLoader.cameraParams = undefined;
        PointCloudLoader.ranges = undefined;
        PointCloudLoader.total_x = 0;
        PointCloudLoader.total_y = 0;
        PointCloudLoader.total_z = 0;
        PointCloudLoader.numberOfPoints = 0;
    }
    
    loadPoints(pointcloud: Point3D[]): void {
        if (pointcloud.length == 0) {
            throw new RangeError("Empty point cloud");
        }
        
        // for calculating camera look at
        for(let i=0; i<pointcloud.length; i++) {
            PointCloudLoader.total_x += pointcloud[i].x;
            PointCloudLoader.total_y += pointcloud[i].y;
            PointCloudLoader.total_z += pointcloud[i].z;
        }

        PointCloudLoader.numberOfPoints += pointcloud.length;
        
        this.updateGeometry(pointcloud);

        let ranges = PointCloudLoader.findRanges(pointcloud);

        if (PointCloudLoader.ranges) {
            ranges.X_MAX > PointCloudLoader.ranges.X_MAX ? PointCloudLoader.ranges.X_MAX = ranges.X_MAX : null;
            ranges.Y_MAX > PointCloudLoader.ranges.Y_MAX ? PointCloudLoader.ranges.Y_MAX = ranges.Y_MAX : null;
            ranges.Z_MAX > PointCloudLoader.ranges.Z_MAX ? PointCloudLoader.ranges.Z_MAX = ranges.Z_MAX : null;
            ranges.X_MIN < PointCloudLoader.ranges.X_MIN ? PointCloudLoader.ranges.X_MIN = ranges.X_MIN : null;
            ranges.Y_MIN < PointCloudLoader.ranges.Y_MIN ? PointCloudLoader.ranges.Y_MIN = ranges.Y_MIN : null;
            ranges.Z_MIN < PointCloudLoader.ranges.Z_MIN ? PointCloudLoader.ranges.Z_MIN = ranges.Z_MIN : null;
        } else {
            PointCloudLoader.ranges = ranges;
        }
    }

    get cameraParam(): CameraParams {
        return {
            position_x: PointCloudLoader.ranges.X_MAX + Math.abs(PointCloudLoader.ranges.X_MAX),
            position_y: PointCloudLoader.ranges.Y_MAX + Math.abs(PointCloudLoader.ranges.Y_MAX),
            position_z: PointCloudLoader.ranges.Z_MAX + Math.abs(PointCloudLoader.ranges.Z_MAX),
            look_x: PointCloudLoader.total_x/PointCloudLoader.numberOfPoints,
            look_y: PointCloudLoader.total_y/PointCloudLoader.numberOfPoints,
            look_z: PointCloudLoader.total_z/PointCloudLoader.numberOfPoints
        }
    }

    private updateGeometry(pointcloud: Point3D[]): void {
        let color;
        for(let i=0; i<pointcloud.length; i++) {
            // TODO: Use native colors
            if (typeof pointcloud[i].r !== 'undefined' 
                && typeof pointcloud[i].g !== 'undefined' 
                && typeof pointcloud[i].b !== 'undefined' ) {
                color = new THREE.Color(
                    pointcloud[i].r/255, 
                    pointcloud[i].g/255, 
                    pointcloud[i].b/255
                );
            } else {
                color = new THREE.Color(1, 0.5, 0);
            }
            this.colors.push(color);
            this.geometry.vertices.push(new THREE.Vector3(
                pointcloud[i].x,
                pointcloud[i].y,
                pointcloud[i].z
            ));
        }
        this.geometry.colors = this.colors;
    }

    getGeometry(): THREE.Geometry {
        return this.geometry;
    }

    getFigure(pointsMaterialParams?: THREE.PointsMaterialParameters): THREE.Points {
        let params = pointsMaterialParams ? pointsMaterialParams : PointCloudLoader.DefaultPointsParams;
        let material = new THREE.PointsMaterial(params);
        let figure: THREE.Points = new THREE.Points(this.geometry, material);
        return figure;
    }

    static get DefaultPointsParams(): THREE.PointsMaterialParameters {
        return {
            size: 0.01,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 1
        }
    }
    
    static findRanges(pointcloud: Point3D[]): Ranges {
        let x_max: number = pointcloud[0].x, 
            x_min: number = pointcloud[0].x;
        let y_max: number = pointcloud[0].y, 
            y_min: number = pointcloud[0].y;
        let z_max: number = pointcloud[0].z, 
            z_min: number = pointcloud[0].z;

        for(let i=0; i<pointcloud.length; i++) {
            x_max = pointcloud[i].x > x_max ? pointcloud[i].x : x_max;
            y_max = pointcloud[i].y > y_max ? pointcloud[i].y : y_max;
            z_max = pointcloud[i].z > z_max ? pointcloud[i].z : z_max;

            x_min = pointcloud[i].x < x_min ? pointcloud[i].x : x_min;
            y_min = pointcloud[i].y < y_min ? pointcloud[i].y : y_min;
            z_min = pointcloud[i].z < z_min ? pointcloud[i].z : z_min;
        }

        return {
            X_MAX: x_max,
            Y_MAX: y_max,
            Z_MAX: z_max,
            X_MIN: x_min,
            Y_MIN: y_min,
            Z_MIN: z_min
        }
    }

}