import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output
} from '@angular/core';
import { fromEvent as observableFromEvent, Subject } from 'rxjs';
import { sampleTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appScrollDetector]'
})
export class ScrollDetectorDirective implements AfterViewInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input('offsetTop') offsetTop = 0;

  @Input('offsetBottom') offsetBottom = 0;

  @Output('onReachTop') onReachTop: EventEmitter<any> = new EventEmitter<any>();

  @Output('onReachBottom')
  onReachBottom: EventEmitter<any> = new EventEmitter<any>();

  constructor(private element: ElementRef, private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      observableFromEvent(this.element.nativeElement, 'scroll', {
        passive: true
      })
        .pipe(
          sampleTime(300),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          const scrollTop: number = this.element.nativeElement.scrollTop;
          const scrollHeight: number = this.element.nativeElement.scrollHeight;
          const clientHeight: number = this.element.nativeElement.clientHeight;

          if (scrollTop <= this.offsetTop) {
            this.zone.run(() => this.onReachTop.emit());
          }

          if (scrollHeight - (scrollTop + clientHeight) <= this.offsetBottom) {
            this.zone.run(() => this.onReachBottom.emit());
          }
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
