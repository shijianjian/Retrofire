import { Component, HostListener, ElementRef, Output, EventEmitter, Input } from "@angular/core";
import { SelectedArea } from "./scene-selection.directive";
import { MainService } from "../main.service";
import { PointerMode } from "../model/pointer.mode";

@Component({
	selector: 'pl-bounding-box',
    templateUrl: './bounding-box.component.html',
    styles: [`
        :host {
            display: flex;
        }
        .bounding-box-movable:hover {
            cursor: move;
        }
        .bounding-box-movable-nwse:hover {
            cursor: nwse-resize;
        }
        .bounding-box-movable-nesw:hover {
            cursor: nesw-resize;
        }
        .bounding-box-movable-ns:hover {
            cursor: ns-resize;
        }
        .bounding-box-movable-ew:hover {
            cursor: ew-resize;
        }
        mat-toolbar-row {
            display: flex;
            flex-direction: row-reverse;
        }
        .bbox-toolbar {
            position: absolute;
            bottom: 0;
            right: 0;
            height: 2em;
            width: 40%;
            min-width: 100px;
            min-height: unset;
            margin-bottom: -2em;
            margin-right: -1px;
            border-radius: 0 0 0 1em;
        }
    `]
})
export class BoundingBoxComponent {

    @Input() start = true;
    @Output() area: EventEmitter<SelectedArea> = new EventEmitter<SelectedArea>();
    @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

    private selectedDiv: HTMLDivElement;
    private selectedArea: SelectedArea;
    private resizingMode: string;
    private mousePositionInBBox;

    constructor(
        private elRef: ElementRef,
        private mainService: MainService
    ) {
        
    }

    onMove(event: string) {
        console.log(event);
        this.resizingMode = event;
    }

    onConfirm(event: Event) {
        event.stopPropagation();
        this.area.emit(this.selectedArea);
    }

    onClear(event: Event) {
        event.stopPropagation();
        this.cancel.emit(true);
    }

    initSettings() {
        this.start = false;
        this.selectedDiv = this.elRef.nativeElement;
        this.selectedArea = {
            startX: this.selectedDiv.offsetLeft,
            startY: this.selectedDiv.offsetTop,
            endX: this.selectedDiv.offsetLeft + this.selectedDiv.offsetWidth,
            endY: this.selectedDiv.offsetTop + this.selectedDiv.offsetHeight
        };
    }

    @HostListener('mousedown', ['$event'])
	public onMouseDown(event: MouseEvent) {
        if (this.mainService.getPointerMode().getValue() === PointerMode.RESIZE) {
            this.start = true;
            let dist_x = event.clientX - this.selectedDiv.offsetLeft;
            let dist_y = event.clientY - this.selectedDiv.offsetTop;
            this.mousePositionInBBox = {x: dist_x, y: dist_y};
        }
    }

    @HostListener('document:mousemove', ['$event'])
	public onMouseMove(event: MouseEvent) {
        if (this.mainService.getPointerMode().getValue() === PointerMode.RESIZE
            && this.selectedArea
            && this.start
        ) {
            let x_tar = event.clientX; 
            let y_tar = event.clientY;
            this.onResizing(x_tar, y_tar);
        }
    }

    @HostListener('document:mouseup', ['$event'])
	public onMouseUp(event: MouseEvent) {
        if (this.mainService.getPointerMode().getValue() === PointerMode.RESIZE
            && this.selectedArea
        ) {
            this.start = false;
            console.log("11111");
        }
    }

    private onResizing(X: number, Y: number){
        switch(this.resizingMode) {
            case 's':
                this.resizeS(Y); break;
            case 'e':
                this.resizeE(X); break;
            case 'n':
                this.resizeN(Y); break;
            case 'w':
                this.resizeW(X); break;
            case 'se':
                this.resizeSE(X, Y); break;
            case 'nw':
                this.resizeNW(X, Y); break;
            case 'sw':
                this.resizeSW(X, Y); break;
            case 'ne':
                this.resizeNE(X, Y); break;
            case 'center':
                this.move(X, Y); break;
        }

    }

    private resizeN(Y: number) {
        if (Y > this.selectedArea.endY) {
            this.selectedDiv.style.top = `${this.selectedArea.endY}px`
            this.selectedDiv.style.height = `${Y - this.selectedArea.endY}px`;
            this.selectedArea.endY = Y;
        } else {
            this.selectedDiv.style.top = `${Y}px`;
            this.selectedDiv.style.height = `${this.selectedArea.endY - Y}px`;
            this.selectedArea.startY = Y;
        }
    }

    private resizeW(X: number) {
        if (X > this.selectedArea.endX) {
            this.selectedDiv.style.left = `${this.selectedArea.endX}px`;
            this.selectedDiv.style.width = `${X - this.selectedArea.endX}px`;
            this.selectedArea.endX = X;
        } else {
            this.selectedDiv.style.left = `${X}px`;
            this.selectedDiv.style.width = `${this.selectedArea.endX - X}px`;
            this.selectedArea.startX = X;
        }
    }

    private resizeS(Y: number) {
        if (Y > this.selectedArea.startY) {
            this.selectedDiv.style.top = `${this.selectedArea.startY}px`;
            this.selectedDiv.style.height = `${Y - this.selectedArea.startY}px`;
            this.selectedArea.endY = Y;
        } else {
            this.selectedDiv.style.top = `${Y}px`;
            this.selectedDiv.style.height = `${this.selectedArea.startY - Y}px`;
            this.selectedArea.startY = Y;
        }
    }

    private resizeE(X: number) {
        if (X > this.selectedArea.startX) {
            this.selectedDiv.style.left = `${this.selectedArea.startX}px`;
            this.selectedDiv.style.width = `${X - this.selectedArea.startX}px`;
            this.selectedArea.endX = X;
        } else {
            this.selectedDiv.style.left = `${X}px`;
            this.selectedDiv.style.width = `${this.selectedArea.startX - X}px`;
            this.selectedArea.startX = X;
        }
    }

    private resizeSE(X: number, Y: number) {
        this.resizeE(X);
        this.resizeS(Y);
    }

    private resizeNW(X: number, Y: number) {
        this.resizeN(Y);
        this.resizeW(X);
    }

    private resizeSW(X: number, Y: number) {
        this.resizeW(X);
        this.resizeS(Y);
    }

    private resizeNE(X: number, Y: number) {
        this.resizeN(Y);
        this.resizeE(X);
    }

    private move(X: number, Y: number) {
        if (X - this.mousePositionInBBox.x > 0) {
            this.selectedDiv.style.left = `${X - this.mousePositionInBBox.x}px`;
        } else {
            this.selectedDiv.style.left = '0px';
        }
        if (Y - this.mousePositionInBBox.y > 0) {
            this.selectedDiv.style.top = `${Y - this.mousePositionInBBox.y}px`;
        } else {
            this.selectedDiv.style.top = '0px';
        }
    }

}