declare const THREE;

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
    
    static calculate(pointcloud: number[][]): CameraParams {
        if (pointcloud.length == 0) {
            throw new RangeError("Empty point cloud");
        }
        
        let total_x: number = 0, 
            total_y: number = 0, 
            total_z: number = 0; // for calculating camera look at

        for(let i=0; i<pointcloud.length; i++) {
            total_x += pointcloud[i][0];
            total_y += pointcloud[i][1];
            total_z += pointcloud[i][2];
        }
        
        let ranges = PointCloudLoader.findRanges(pointcloud);

        return {
            position_x: ranges.X_MAX + Math.abs(ranges.X_MAX),
            position_y: ranges.Y_MAX + Math.abs(ranges.Y_MAX),
            position_z: ranges.Z_MAX + Math.abs(ranges.Z_MAX),
            look_x: total_x/pointcloud.length,
            look_y: total_y/pointcloud.length,
            look_z: total_z/pointcloud.length
        }
    }

    static getPointsGeometry(pointcloud: number[][], defaultColor?: THREE.Color): THREE.Geometry {
        if (!defaultColor) {
            defaultColor = new THREE.Color(1, 0.5, 0)
        }
        let geometry: THREE.Geometry = new THREE.Geometry();
        let colors: THREE.Color[] = [];
        for(let i=0; i<pointcloud.length; i++) {
            // TODO: Use native colors
            colors.push(defaultColor);
            geometry.vertices.push(new THREE.Vector3(
                pointcloud[i][0],
                pointcloud[i][1],
                pointcloud[i][2]
            ));
        }
        geometry.colors = colors;
        return geometry;
    }

    static loadPoints(geometry: THREE.Geometry, pointsMaterialParams?: THREE.PointsMaterialParameters): THREE.Points {
        let params = pointsMaterialParams ? pointsMaterialParams : PointCloudLoader.DefaultPointsParams;
        let material = new THREE.PointsMaterial(params);
        let figure: THREE.Points = new THREE.Points(geometry, material);
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
    
    static findRanges(pointcloud: number[][]): Ranges {
        let x_max: number = pointcloud[0][0], 
            x_min: number = pointcloud[0][0];
        let y_max: number = pointcloud[0][1], 
            y_min: number = pointcloud[0][1];
        let z_max: number = pointcloud[0][2], 
            z_min: number = pointcloud[0][2];

        for(let i=0; i<pointcloud.length; i++) {
            x_max = pointcloud[i][0] > x_max ? pointcloud[i][0] : x_max;
            y_max = pointcloud[i][1] > y_max ? pointcloud[i][1] : y_max;
            z_max = pointcloud[i][2] > z_max ? pointcloud[i][2] : z_max;

            x_min = pointcloud[i][0] < x_min ? pointcloud[i][0] : x_min;
            y_min = pointcloud[i][1] < y_min ? pointcloud[i][1] : y_min;
            z_min = pointcloud[i][2] < z_min ? pointcloud[i][2] : z_min;
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