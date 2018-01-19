import { Directive, ElementRef, Renderer, HostListener, Output, EventEmitter, ComponentFactoryResolver, Injector, ApplicationRef, EmbeddedViewRef, ComponentRef } from "@angular/core";

import { MainService } from "../main.service";
import { PointerMode } from "../model/pointer.mode";
import { BoundingBoxComponent } from "./bounding-box.component";

export interface SelectedArea {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface BoundingBox {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

@Directive({
    selector: '[plSceneSelection]'
})
export class SceneSelectionDirective {

    constructor(
        // private el: ElementRef,
        // private renderer: Renderer,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector,
        private mainService: MainService
    ) {

    }

    @Output() private boundingBox: EventEmitter<BoundingBox> = new EventEmitter();

    private start = false;
    private selectedDiv: HTMLElement;
    private componentRef: ComponentRef<BoundingBoxComponent>;
    private selectedArea: SelectedArea = {
        startX: undefined,
        startY: undefined,
        endX: undefined,
        endY: undefined,
    }

    /**
     * Cancel the next operation.
     * Remove everything if set force to true.
     * @param force boolean
     */
    onCancel(force: boolean) {
        if (force) {
            this.selectionToggle(false);
            this.destroySelectArea();
            return;
        }
        if (this.start) {
            this.selectionToggle(false);
        } else if (typeof this.componentRef !== 'undefined') {
            this.destroySelectArea();
        }
    }

    private initSelectArea() {
        if (typeof this.componentRef !== 'undefined') {
            this.destroySelectArea();
        }
        this.componentRef = this.componentFactoryResolver
            .resolveComponentFactory(BoundingBoxComponent).create(this.injector);
        this.appRef.attachView(this.componentRef.hostView);
        this.selectedDiv = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        
        this.componentRef.instance.area.subscribe( (data: SelectedArea) => {
            this.selectedArea = data;
            this.mainService.setPointerMode(PointerMode.POINT);
            this.emit();
            this.destroySelectArea();
        });

        this.componentRef.instance.cancel.subscribe( (data: boolean) => {
            if (data === true) {
                this.mainService.setPointerMode(PointerMode.POINT);
                this.destroySelectArea();
            }
        });

        this.selectedDiv.style.position = 'absolute';
        this.selectedDiv.style.opacity = '50%';
        this.selectedDiv.style.background = 'rgba(252, 81, 91, 0.1)';
        this.selectedDiv.style.border = '1px solid #c2185b';
        document.body.appendChild(this.selectedDiv);
    }

    private destroySelectArea() {
        this.appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
    }

    private selectionToggle(state: boolean) {
        if (state === true) {
            this.start = true;
            this.initSelectArea();
        } else {
            this.start = false;
        }
    }

    private emit() {
        this.boundingBox.emit({
            top: this.selectedArea.startY < this.selectedArea.endY ? this.selectedArea.startY : this.selectedArea.endY,
            bottom: this.selectedArea.startY > this.selectedArea.endY ? this.selectedArea.startY : this.selectedArea.endY,
            right: this.selectedArea.startX > this.selectedArea.endX ? this.selectedArea.startX : this.selectedArea.endX,
            left: this.selectedArea.startX < this.selectedArea.endX ? this.selectedArea.startX : this.selectedArea.endX,
        });
    }

    @HostListener('mousedown', ['$event'])
	public onMouseDown(event: MouseEvent) {
        if (this.mainService.getPointerMode().getValue() === PointerMode.CROP) {
            this.selectionToggle(true);
            this.selectedArea.startX = event.clientX;
            this.selectedArea.startY = event.clientY;
        }
    }

    @HostListener('document:mouseup', ['$event'])
	public onMouseUp(event: MouseEvent) {
        if (this.mainService.getPointerMode().getValue() === PointerMode.CROP) {
            this.selectionToggle(false);
            this.selectedArea.endX = event.clientX;
            this.selectedArea.endY = event.clientY;
            console.log(this.selectedArea);
            this.componentRef.instance.initSettings();
            this.mainService.setPointerMode(PointerMode.RESIZE);
        }
    }

    @HostListener('mousemove', ['$event'])
	public onMouseMove(event: MouseEvent) {
        if (this.mainService.getPointerMode().getValue() === PointerMode.CROP
            && this.start
        ) {
            let x_tar = event.clientX; 
            let y_tar = event.clientY;
            if (x_tar > this.selectedArea.startX) {
                this.selectedDiv.style.left = `${this.selectedArea.startX}px`
                this.selectedDiv.style.width = `${x_tar - this.selectedArea.startX}px`;
            } else {
                this.selectedDiv.style.left = `${x_tar}px`
                this.selectedDiv.style.width = `${this.selectedArea.startX - x_tar}px`;
            }
            if (y_tar > this.selectedArea.startY) {
                this.selectedDiv.style.top = `${this.selectedArea.startY}px`
                this.selectedDiv.style.height = `${y_tar - this.selectedArea.startY}px`;
            } else {
                this.selectedDiv.style.top = `${y_tar}px`
                this.selectedDiv.style.height = `${this.selectedArea.startY - y_tar}px`;
            }
        }
    }
}