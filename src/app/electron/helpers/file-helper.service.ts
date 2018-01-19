import { Injectable } from "@angular/core";
import { FileFilter } from "electron";

import { PTSLoader } from "./fileLoaders/pts-file.loader";
import { MainService } from "../../main.service";

@Injectable()
export class FileHelperService {

    constructor(private mainService: MainService) {}

    readFile(filepath: string) {
        let fileLoader = PTSLoader.getLoader;
        fileLoader.read(filepath).then(
            res => {
                console.log(res.length)
                this.mainService.points.next(res);
            },
            rej => {
                console.log(rej);
            }
        )
        
    }

}