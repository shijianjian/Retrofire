import { Injectable, OnInit } from "@angular/core";

import { ipcRenderer, remote } from 'electron';
import * as childProcess from 'child_process';

import { MenuService } from "./components/menu.service";


@Injectable() 
export class ElectronService {

    ipcRenderer: typeof ipcRenderer;
    childProcess: typeof childProcess;
  
    constructor(private menu: MenuService) {

    }

    buildMenu() {
        this.menu.build();
    }
    // isElectron = () => {
    //     return window && window.process && window.process.type;
    // }
}