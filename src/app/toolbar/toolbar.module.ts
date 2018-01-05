
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatToolbarModule, MatIconModule } from '@angular/material';

import { ToolbarComponent } from "./toolbar.component";

@NgModule({
    declarations: [
      ToolbarComponent
    ],
    imports: [
      BrowserModule,
      MatToolbarModule,
      MatIconModule
    ],
    providers: [
    ],
    exports: [
      ToolbarComponent
    ]
  })
export class ToolbarModule { }