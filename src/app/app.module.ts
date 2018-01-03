import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ElectronService } from './electron/electron.service';
import { MenuService } from './electron/components/menu.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    ElectronService,
    MenuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
