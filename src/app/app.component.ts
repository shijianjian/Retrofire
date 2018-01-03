import { Component } from '@angular/core';
import { ElectronService } from './electron/electron.service';
import { MainService } from './main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

	constructor(private electronService: ElectronService) {
		this.electronService.buildMenu();
	}

}
