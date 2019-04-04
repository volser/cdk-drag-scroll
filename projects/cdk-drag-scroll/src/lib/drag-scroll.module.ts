import { NgModule } from '@angular/core';

import { DragScrollDirective } from './drag-scroll.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [DragDropModule],
  declarations: [DragScrollDirective],
  exports: [DragScrollDirective]
})
export class DragScrollModule {}
