import { Injectable } from "@angular/core";
import { OpenDialogOptions } from "electron";

import * as electron from 'electron';
declare const app: typeof electron;

@Injectable()
export class MenuService {

    build() {
        console.log(app)
        console.log(app.Menu)
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
            title: 'Import a file'
        };
        app.dialog.showOpenDialog(options, (cb)=> {
            console.log(cb);
        });
    }
}