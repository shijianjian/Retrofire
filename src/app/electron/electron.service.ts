import { Injectable } from "@angular/core";

import { MenuService } from "./components/menu.service";

import * as Electron from 'electron';
declare const app: typeof Electron;

@Injectable() 
export class ElectronService {
  
    constructor(private menu: MenuService) {

    }

    buildMenu() {
        this.menu.createMenu();
    }

    // isElectron = () => {
    //     return window && window.process && window.process.type;
    // }
}