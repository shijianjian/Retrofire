import { PointCloudHeader, XYZHeader, PTSHeader, PTXHeader } from "./pointcloud.header";
import { Cloud, PointCloudFileType, Point3D } from "../../../model/pointcloud";

export abstract class Loader {
    abstract readIn(arr: string[]): void;
    protected parseToFloat(str: string) {
        return isNaN(parseFloat(str)) ? undefined : parseFloat(str);
    }
}

export class CloudHeaderLoader extends Loader {

    private header: PointCloudHeader;
    private fileType: PointCloudFileType;
    private completed: boolean;
    
    constructor(extension: string | PointCloudFileType) {
        super();
        if (typeof extension === 'string') {
            this.fileType = PointCloudFileType[extension];
        } else {
            this.fileType = extension;
        }
        this.reset();
    }

    reset() {
        this.completed = false;
        this.header = this.createHeaderByFileType(this.fileType);
    }

    readIn(arr: string[]) {
        if (this.completed === true) {
            throw new TypeError(`Header has been fully defined.`)
        }
        switch(this.fileType) {
            case PointCloudFileType.XYZ:
                this.readToXYZHeader(arr);
                break;
            case PointCloudFileType.PTS:
                this.readToPTSHeader(arr);
                break;
            case PointCloudFileType.PTX:
                this.readToPTXHeader(arr);
                break;
            default:
                throw new ReferenceError(`No header constructor found for '${this.fileType}'`);
        }
    }

    private readToXYZHeader(arr: string[]) {
        (this.header as XYZHeader).rows = this.parseToFloat(arr[0]);
        this.setComplete();
    }

    private readToPTSHeader(arr: string[]) {
        (this.header as PTSHeader).rows = this.parseToFloat(arr[0]);
        this.setComplete();
    }

    private readToPTXHeader(arr: string[]) {
        if (typeof (this.header as PTXHeader).columns === 'undefined') {
            (this.header as PTXHeader).columns = this.parseToFloat(arr[0]);
        } else if (typeof (this.header as PTXHeader).rows === 'undefined') {
            (this.header as PTXHeader).rows = this.parseToFloat(arr[0]);
        } else if (typeof (this.header as PTXHeader).scannerPosition === 'undefined') {
            (this.header as PTXHeader).scannerPosition 
                    = {x: this.parseToFloat(arr[0]), y: this.parseToFloat(arr[1]), z: this.parseToFloat(arr[2])};
        } else if (typeof (this.header as PTXHeader).scannerX === 'undefined') {
            (this.header as PTXHeader).scannerX 
                    = {x: this.parseToFloat(arr[0]), y: this.parseToFloat(arr[1]), z: this.parseToFloat(arr[2])};
        } else if (typeof (this.header as PTXHeader).scannerY === 'undefined') {
            (this.header as PTXHeader).scannerY 
                    = {x: this.parseToFloat(arr[0]), y: this.parseToFloat(arr[1]), z: this.parseToFloat(arr[2])};
        } else if (typeof (this.header as PTXHeader).scannerZ === 'undefined') {
            (this.header as PTXHeader).scannerZ 
                    = {x: this.parseToFloat(arr[0]), y: this.parseToFloat(arr[1]), z: this.parseToFloat(arr[2])};
        } else if (typeof (this.header as PTXHeader).transformationMatrix1 === 'undefined') {
            (this.header as PTXHeader).transformationMatrix1 
                    = {r1: this.parseToFloat(arr[0]), r2: this.parseToFloat(arr[1]), r3: this.parseToFloat(arr[2]), r4: this.parseToFloat(arr[3])};
        } else if (typeof (this.header as PTXHeader).transformationMatrix2 === 'undefined') {
            (this.header as PTXHeader).transformationMatrix2 
                    = {r1: this.parseToFloat(arr[0]), r2: this.parseToFloat(arr[1]), r3: this.parseToFloat(arr[2]), r4: this.parseToFloat(arr[3])};  
        } else if (typeof (this.header as PTXHeader).transformationMatrix3 === 'undefined') {
            (this.header as PTXHeader).transformationMatrix3
                    = {r1: this.parseToFloat(arr[0]), r2: this.parseToFloat(arr[1]), r3: this.parseToFloat(arr[2]), r4: this.parseToFloat(arr[3])};
        } else if (typeof (this.header as PTXHeader).transformationMatrix4 === 'undefined') {
            (this.header as PTXHeader).transformationMatrix4
                    = {r1: this.parseToFloat(arr[0]), r2: this.parseToFloat(arr[1]), r3: this.parseToFloat(arr[2]), r4: this.parseToFloat(arr[3])};
            this.setComplete();
        }
    }

    getHeader() {
        return this.header;
    }

    setCompleted(completed: boolean) {
        this.completed = completed;
    }

    isCompleted() {
        return this.completed;
    }

    private setComplete() {
        this.completed = true;
    }

    private createHeaderByFileType(fileType: PointCloudFileType) {
        switch(fileType) {
            case PointCloudFileType.XYZ:
                return new XYZHeader();
            case PointCloudFileType.PTS:
                return new PTSHeader();
            case PointCloudFileType.PTX:
                return new PTXHeader();
            default:
                throw new ReferenceError(`No header constructor found for '${fileType}'`);
        }
    }

}

export class CloudLoader extends Loader {

    private cloud: Cloud;
    private fileType: PointCloudFileType;
    private header: PointCloudHeader;
    private headerLoader: CloudHeaderLoader;

    private newObj: boolean;

    constructor(extension: string | PointCloudFileType) {
        super();
        if (typeof extension === 'string') {
            this.fileType = PointCloudFileType[extension];
        } else {
            this.fileType = extension;
        }
        this.renewCloud();
    }

    readIn(arr: string[]) {
        // set header
        if ((this.fileType === PointCloudFileType.XYZ 
            || this.fileType === PointCloudFileType.PTS
            ) && arr.length !== 1) {
            this.headerLoader.setCompleted(true);
        }
        if (arr.length === 1) {
            this.headerLoader.reset();
        }
        if (!this.headerLoader.isCompleted()) {
            this.newObj = true;
            this.headerLoader.readIn(arr);
        } else {
            if (this.newObj) {
                this.cloud.createNewCloudObject();
                this.cloud.clouds[this.cloud.clouds.length - 1].setHeader(Object.assign(this.headerLoader.getHeader()));
                this.newObj = false;
            }
            let point: Point3D = {
                x: this.parseToFloat(arr[0]), 
                y: this.parseToFloat(arr[1]), 
                z: this.parseToFloat(arr[2]), 
                intensity: arr.length > 3 ? this.parseToFloat(arr[3]) : undefined, 
                r: arr.length > 4 ? this.parseToFloat(arr[4]) : undefined, 
                g: arr.length > 5 ? this.parseToFloat(arr[5]) : undefined, 
                b: arr.length > 6 ? this.parseToFloat(arr[6]) : undefined
            };
            this.cloud.insertPoint(point);
        }
    }

    getCloud() {
        return this.cloud;
    }

    renewCloud() {
        this.cloud = new Cloud();
        this.headerLoader = new CloudHeaderLoader(this.fileType);
    }

}