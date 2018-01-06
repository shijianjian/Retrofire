import { Component, HostListener } from '@angular/core';
import { ElectronService } from './electron/electron.service';
import { MainService } from './main.service';
import { PointerMode } from './model/pointer.mode';

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

	constructor(
    private electronService: ElectronService,
    private mainService: MainService
  ) {
		this.electronService.buildMenu();
  }
  

	@HostListener('document:keydown', ['$event'])
	public onKeyPress(event: KeyboardEvent) {
		event.stopPropagation();
		console.log("onKeyPress: " + event.key);
		if (event.keyCode === 27) { // on Press Escape
			this.mainService.setPointerMode(PointerMode.POINT);
		}
	}

}
