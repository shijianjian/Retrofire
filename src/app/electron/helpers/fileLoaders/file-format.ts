export interface FileInsider {
    extension?: 'pts' | 'xyz' | 'ptx',
    points: number[][]
}

export interface XYZPoint {
    x: number,
    y: number,
    z: number,
}

export interface Cloud {
    index: number,
    points: XYZPoint[]
}

export class PointClouds {
    
}