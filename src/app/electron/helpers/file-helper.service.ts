import { Injectable } from "@angular/core";
import { FileFilter } from "electron";

import { MainService } from "../../main.service";
import { FileLoader } from "./loaders/file.loader";

@Injectable()
export class FileHelperService {

    constructor(private mainService: MainService) {}

    readFile(filepath: string) {
        let fileLoader = FileLoader.getLoader;
        fileLoader.load(filepath).read().then(
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