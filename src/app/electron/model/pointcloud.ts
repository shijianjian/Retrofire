import { PointCloudHeader } from "../helpers/loaders/pointcloudLoaders/pointcloud.header";

export enum PointCloudFileType {
    XYZ = "XYZ",
    PTS = "PTS",
    PTX = "PTX",
    PCD = "PCD"
}

export interface Point3D {
    x: number,
    y: number,
    z: number,
    intensity?: number,
    r?: number,
    g?: number,
    b?: number,
}

export class Cloud {

    private _clouds: CloudObject[];

    constructor() {
        this._clouds = [];
    }

    createNewCloudObject() {
        this._clouds.push(new CloudObject());
    }

    insertPoint(point: Point3D, index?: number) {
        if (this._clouds.length === 0) {
            this.createNewCloudObject();
        }
        if (typeof index === 'undefined' || typeof index === null) {
            this._clouds[this._clouds.length - 1].addPoint(point);
        } else {
            this._clouds.forEach((value, idx, arr) => {
                if (value.getIndex() === index) {
                    arr[idx].addPoint(point);
                }
            });
        }
    }

    setCloudFileType(fileType: PointCloudFileType, index?: number) {
        if (typeof index === 'undefined' || typeof index === null) {
            this._clouds[this._clouds.length - 1].setFileType(fileType);
        } else {
            this._clouds.forEach((value, idx, arr) => {
                if (value.getIndex() === index) {
                    arr[idx].setFileType(fileType);
                }
            });
        }
    }

    get clouds(): CloudObject[] {
        return this._clouds;
    }

}

export class CloudObject {

    private static _idIt = 0;

    private _id: number;
    private _header: PointCloudHeader;
    private _points: Point3D[] = [];
    private _fileType: PointCloudFileType;

    constructor() {
        this._id = CloudObject._idIt;
        CloudObject._idIt += 1;
    }

    getIndex() {
        return this._id;
    }

    getHeader() {
        return this._header;
    }

    setHeader(header: PointCloudHeader) {
        this._header = header;
    }

    getPoints() {
        return this._points;
    }

    setPoints(points: Point3D[]) {
        this._points = points;
    }

    addPoint(point: Point3D) {
        this._points.push(point);
    }

    setFileType(fileType: PointCloudFileType) {
        this._fileType = fileType;
    }

    getFileType() {
        return this._fileType;
    }

}