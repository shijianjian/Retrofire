import { XYZPoint, Cloud, PointClouds } from "./file-format";

export interface PTSFilePoint extends XYZPoint {
    intensity?: number,
    r?: number,
    g?: number,
    b?: number,
}

export class PTSFile extends PointClouds {

    private numberOfObjects = 0;
    private clouds: Cloud[] = [];

    constructor() {
        super();
    }

    /**
     * Append point to the end if objectIndex is not given.
     * Or it will insert the point to the end of the specified object.
     * @param point 
     * @param index 
     */
    insertPoint(point: PTSFilePoint, index?: number): void {
        if (typeof index === 'undefined') {
            this.clouds[this.clouds.length - 1].points.push(point);
        } else {
            this.clouds[index].points.push(point);
        }
    }

    isIndexExists(index: number): boolean {
        for(let i=0; i<this.clouds.length; i++) {
            if (this.clouds[i].index === index) {
                return true;
            }
        }
        return false;
    }
    
}