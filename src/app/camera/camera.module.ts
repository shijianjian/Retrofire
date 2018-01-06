import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';

import { CameraComponent } from './camera.component';
import { CameraService } from './camera.service';
import { CameraGuiService } from './camera-gui.service';
import { SceneSelectionDirective } from './scene-selection.directive';
import { BoundingBoxComponent } from './bounding-box.component';

@NgModule({
  declarations: [
    CameraComponent,
    SceneSelectionDirective,
    BoundingBoxComponent
  ],
  imports: [
    BrowserModule,
    MatToolbarModule
  ],
  exports: [
    CameraComponent
  ],
  entryComponents: [
    BoundingBoxComponent
  ],
  providers: [
    CameraService,
    CameraGuiService
  ]
})
export class CameraModule { }
