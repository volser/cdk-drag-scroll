import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragScrollModule } from 'src/drag-scroll.module';
import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  imports: [BrowserModule, DragScrollModule],
  bootstrap: [DemoComponent]
})
export class DemoModule {}