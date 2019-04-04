import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MyListComponent } from './my-list/my-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragScrollModule } from 'cdk-drag-scroll';

@NgModule({
  declarations: [AppComponent, MyListComponent],
  imports: [BrowserModule, DragDropModule, DragScrollModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
