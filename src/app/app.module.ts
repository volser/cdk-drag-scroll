import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyListComponent } from './my-list/my-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragScrollModule } from 'cdk-drag-scroll';
import { ScrollDetectorDirective } from './scroll-detector.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AppComponent, MyListComponent, ScrollDetectorDirective],
  imports: [BrowserModule, DragDropModule, DragScrollModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
