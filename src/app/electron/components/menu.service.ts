import { Injectable } from "@angular/core";
import { OpenDialogOptions } from "electron";

import * as electron from 'electron';
import { FileHelperService } from "../helpers/file-helper.service";
declare const app: typeof electron;

@Injectable()
export class MenuService {

    constructor(private fileHelperService: FileHelperService){}

    build() {
        app.Menu.setApplicationMenu(this.menu());
    }

    private menu(){ 
        return app.Menu.buildFromTemplate([{
            label: 'File',
            submenu: [{
                label: 'Open',
                click: () => {
                    this.openFileDialog();
                }
            }]
        }])
    }

    private openFileDialog() {
        let options: OpenDialogOptions = {
            title: 'Import a file',
            filters: this.fileHelperService.fileFilters
        };
        app.dialog.showOpenDialog(options, (cb)=> {
            console.log(cb);
            this.fileHelperService.readFile(cb[0]);
        });
    }

}