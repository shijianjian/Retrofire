import { PointCloudFileType } from "../../../model/pointcloud";

export abstract class PointCloudHeader {

}

export class XYZHeader extends PointCloudHeader {
    rows: number;
}

export class PTSHeader extends PointCloudHeader {
    rows: number;
}

export class PTXHeader extends PointCloudHeader {
    columns: number;
    rows: number;
    scannerPosition: SettingVector;
    scannerX: SettingVector;
    scannerY: SettingVector;
    scannerZ: SettingVector;
    transformationMatrix1: TransformationMatrixRow; // 4x4 matrix for rotation and translation
    transformationMatrix2: TransformationMatrixRow; // 4x4 matrix for rotation and translation
    transformationMatrix3: TransformationMatrixRow; // 4x4 matrix for rotation and translation
    transformationMatrix4: TransformationMatrixRow; // 4x4 matrix for rotation and translation
}

export interface SettingVector {
    x: number;
    y: number;
    z: number;
}

export class TransformationMatrixRow {
    r1: number;
    r2: number;
    r3: number;
    r4: number;
}