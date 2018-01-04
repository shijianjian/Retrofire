import { Component } from '@angular/core';
import { ElectronService } from './electron/electron.service';
import { MainService } from './main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles:[`
  :host {
	  display: block;
	  width: 100%;
	  height: 100%;
  }
  `]
})
export class AppComponent{

	constructor(private electronService: ElectronService) {
		this.electronService.buildMenu();
	}

}
