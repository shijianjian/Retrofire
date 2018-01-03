import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class MainService {

    points: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
    
}