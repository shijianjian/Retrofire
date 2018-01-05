import { Component } from '@angular/core';

import { MainService } from '../main.service';
import { PointerMode } from '../model/pointer.mode';

@Component({
  selector: 'pl-toolbar',
  templateUrl: './toolbar.component.html',
  styles:[`
    :host {
        display: block;
        position: fixed;
        left: 2em;
    }
    mat-toolbar {
        border-radius: 0 0 1em 1em;
    }
    mat-icon:hover {
        cursor: pointer;
        opacity: 0.85;
    }
  `]
})
export class ToolbarComponent{

    showSecondToolbar = false;

    constructor(private mainService: MainService) {}

    onCrop() {
        this.mainService.setPointerMode(PointerMode.CROP);
    }

}
