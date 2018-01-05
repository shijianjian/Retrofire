import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CameraComponent } from './camera.component';
import { CameraService } from './camera.service';
import { CameraGuiService } from './camera-gui.service';

@NgModule({
  declarations: [
    CameraComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    CameraComponent
  ],
  providers: [
    CameraService,
    CameraGuiService
  ]
})
export class CameraModule { }
