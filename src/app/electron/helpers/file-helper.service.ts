import { Injectable } from "@angular/core";
import { FileFilter } from "electron";

import { PTSLoader } from "./fileLoaders/pts-file.loader";
import { MainService } from "../../main.service";

@Injectable()
export class FileHelperService {

    constructor(private mainService: MainService) {}
    
    private supported_file_extensions: FileFilter[] = [{
        name: 'PTS Files',
        extensions: ['pts']
    }];

    get fileFilters(): FileFilter[] {
        return this.supported_file_extensions;
    }

    isValidFileType(filepath: string[]): boolean {
        filepath.forEach((path) => {
            let ext = path.substring(path.lastIndexOf('.')).toLowerCase();
            try {
                // validate file
            } catch(err) {
                console.log(err);
                return false;
            }
        });
        return true;
    }

    readFile(filepath: string) {
        let fileLoader = PTSLoader.getLoader;
        fileLoader.read(filepath).then(
            res => {
                console.log(res)
                this.mainService.points.next(res);
            },
            rej => {
                console.log(rej);
            }
        )
        
    }

}