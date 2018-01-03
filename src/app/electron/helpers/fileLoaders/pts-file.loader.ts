import { validatePoint } from './array-validator';
import * as _fs from 'fs';
import { StringDecoder } from 'string_decoder';

declare const fs: typeof _fs;

export class PTSLoader {

    private static loader: PTSLoader;

    private constructor() {

    }

    static get getLoader() {
        if(typeof PTSLoader.loader === 'undefined') {
            PTSLoader.loader = new PTSLoader();
        }
        return PTSLoader.loader;
    }

    read(filename): Promise<number[][]> {
        let readStream = fs.createReadStream(filename, {
            flags: 'r'
        });

        let res = [];
        let arr = [];
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
                arr = Array.from(line.split(' '));
                arr.forEach((ele, idx, arrcb) => {
                    arrcb[idx] = parseInt(ele);
                })
                if(validatePoint(arr)) {
                    res.push(arr);
                } else {
                    // Error Handling
                }
                line = '';
            });
            readStream.resume();
        });
    
        return new Promise(
            (resolve, reject) => {
                // File is done being read
                readStream.on('close', () => {
                    // Create a buffer of the image from the stream
                    resolve(res);
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