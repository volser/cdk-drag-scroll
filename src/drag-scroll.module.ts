import { NgModule } from '@angular/core';

import { DragScrollDirective } from './drag-scroll.directive';

@NgModule({
  declarations: [DragScrollDirective],
  exports: [DragScrollDirective]
})
export class DragScrollModule {}
