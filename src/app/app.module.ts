import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ElectronService } from './electron/electron.service';
import { MenuService } from './electron/components/menu.service';
import { FileHelperService } from './electron/helpers/file-helper.service';
import { CameraModule } from './camera/camera.module';
import { MainService } from './main.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CameraModule
  ],
  providers: [
    MainService,
    ElectronService,
    MenuService,
    FileHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
