import { PointCloudHeader } from "../helpers/loaders/pointcloudLoaders/pointcloud.header";

export enum PointCloudFileType {
    XYZ = "xyz",
    PTS = "pts",
    PTX = "ptx",
    PCD = "pcd"
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

    private static _idIt = 0;

    private _id: number;
    private _header: PointCloudHeader;
    private _points: Point3D[];
    private _fileType: PointCloudFileType;

    constructor() {
        this._id = Cloud._idIt;
        Cloud._idIt += 1;
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

    getFileType() {
        return this._fileType;
    }

}