import { Injectable } from "@angular/core";
import { FileFilter } from "electron";

import { PTSLoader } from "./fileLoaders/pts-file.loader";
import { MainService } from "../../main.service";

@Injectable()
export class FileHelperService {

    constructor(private mainService: MainService) {}

    readFile(filepath: string) {
        let fileLoader = PTSLoader.getLoader;
        fileLoader.load(filepath).read().then(
            res => {
                console.log(res.points.length)
                this.mainService.points.next(res);
            },
            rej => {
                console.log(rej);
            }
        )
        
    }

}