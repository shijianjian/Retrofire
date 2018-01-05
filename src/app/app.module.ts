import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ElectronService } from './electron/electron.service';
import { MenuService } from './electron/components/menu.service';
import { FileHelperService } from './electron/helpers/file-helper.service';
import { CameraModule } from './camera/camera.module';
import { MainService } from './main.service';
import { ToolbarModule } from './toolbar/toolbar.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CameraModule,
    ToolbarModule
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
