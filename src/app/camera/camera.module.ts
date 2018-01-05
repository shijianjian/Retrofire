import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CameraComponent } from './camera.component';
import { CameraService } from './camera.service';
import { CameraGuiService } from './camera-gui.service';
import { SceneSelectionDirective } from './scene-selection.directive';

@NgModule({
  declarations: [
    CameraComponent,
    SceneSelectionDirective
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
