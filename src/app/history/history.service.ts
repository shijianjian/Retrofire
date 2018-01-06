import { Injectable } from "@angular/core";

export enum OperationType {
    CREATE_BOUNDING_BOX,
    RESIZE_BOUNDING_BOX
}

export enum OperationStatus {
    STARTED,
    FINISHED
}

export interface Operation {
    type: OperationType,
    status: OperationStatus
}

@Injectable()
export class HistoryService {

    private operations: Operation[];

    startOperation(operation: OperationType) {
        this.operations.push({
            type: operation,
            status: OperationStatus.STARTED
        })
    }

    finishOperation(operation: OperationType) {
        let target;
        for (let i=0; i<this.operations.length; i++) {
            if(this.operations[i].type === operation) {
                target = i;
                break;
            }
        }
        if (target) {
            this.operations.splice(target, 1);
        } else {
            throw new TypeError("Can't finilize a not existed operation.");
        }
    }

    isOperationExisted(operation: OperationType) {
        this.operations.forEach(value => {
            if (value.type === operation) {
                return true;
            }
        })
        return false;
    }

}