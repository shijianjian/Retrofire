export enum IPCEvents {
    SEND_POINTS_TO_NEW_WINDOW = "send-points-to-new-window",
    SEND_POINT_CLOUD = "send-point-cloud"
}

export interface IPCData {
    points?: number[][];
}