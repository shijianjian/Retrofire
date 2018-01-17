import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SideListComponent } from "./side-list.component";

@NgModule({
    declarations: [
        SideListComponent
    ],
    imports: [
        BrowserModule,
    ],
    providers: [
    ],
    exports: [
        SideListComponent
    ]
})
export class SideListModule { }