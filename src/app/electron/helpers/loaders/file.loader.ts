import * as _fs from 'fs';
import { StringDecoder } from 'string_decoder';
import { CloudLoader } from './pointcloudLoaders/pointcloud.loader';
import { Cloud } from '../../model/pointcloud';

declare const fs: typeof _fs;

export class FileLoader {

    private static loader: FileLoader;
    private filename: string;
    private extension: string;

    private constructor() {

    }

    static get getLoader() {
        if(typeof FileLoader.loader === 'undefined') {
            FileLoader.loader = new FileLoader();
        }
        return FileLoader.loader;
    }

    load(filename: string): FileLoader {
        this.filename = filename;
        this.extension = filename.substring(filename.lastIndexOf(".") + 1);
        return this;
    }

    read(): Promise<Cloud[]> {

        let readStream = fs.createReadStream(this.filename, {
            flags: 'r'
        });

        let clouds: Cloud[] = [];
        let loader = new CloudLoader(this.extension);
        let decoder = new StringDecoder('utf8');
    
        let lastLine = '';
        // Listen for data
        readStream.on('data', (chunk) => {
            readStream.pause();
            let textChunk = decoder.write(chunk);
            // count in the last line in previous chunk
            textChunk = lastLine + textChunk;
            let idx = textChunk.lastIndexOf("\n");
            //save the last one array for next chunk
            lastLine = textChunk.substring(idx);
            textChunk.substring(0, idx);
            let lines = textChunk.split("\n");
            lines.forEach((line) => {
                let arr = line.split(" ");
                if (arr.length === 1) {
                    clouds.push(Object.assign({}, loader.getCloud()));
                    loader.renewCloud();
                }
                loader.readIn(arr);
            });
            readStream.resume();
        });
    
        return new Promise(
            (resolve, reject) => {
                // File is done being read
                readStream.on('close', () => {
                    // Create a buffer of the image from the stream
                    resolve(clouds);
                });
                // Handle any errors while reading
                readStream.on('error', err => {
                    // handle error
                    // File could not be read
                    reject(err);
                });
            }
        )
    }
}