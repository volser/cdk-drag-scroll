import { CdkDrag, DragRef } from '@angular/cdk/drag-drop';
import {
  Directive,
  OnDestroy,
  NgZone,
  Input,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AutoScroll } from './auto-scroll';
import { DragDebugService } from './drag-debug.service';

@Directive({
  selector: '[vsDragScroll]',
  exportAs: 'vsDragScroll'
})
export class DragScrollDirective<T = any> implements OnDestroy, OnChanges {
  destroy$ = new Subject<void>();
  stopDragging$ = new Subject<void>();
  dragRef: DragRef<CdkDrag<T>>;
  autoScroll: AutoScroll;
  lastScroll = {
    top: 0,
    left: 0
  };

  @Input('vsDragScrollConnectedTo') dragConnectedIds: string[];
  @Input('vsDragScrollContainer') scrollContainer: HTMLElement;

  constructor(
    private cdkDrag: CdkDrag,
    private dragDebugService: DragDebugService,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.dragRef = this.cdkDrag['_dragRef'];

    if (this.dragRef) {
      this.zone.runOutsideAngular(() => {
        this.dragRef.started.pipe(takeUntil(this.destroy$)).subscribe(event => {
          this.log('Started', event, this.dragRef.isDragging());
          this.started();
        });

        this.dragRef.ended.pipe(takeUntil(this.destroy$)).subscribe(event => {
          this.log('Ended', event);
          this.ended();
        });

        this.dragRef.entered.pipe(takeUntil(this.destroy$)).subscribe(event => {
          this.log('Entered', event);
          this.entered();
        });

        this.dragRef.exited.pipe(takeUntil(this.destroy$)).subscribe(event => {
          this.log('Exited', event);
          this.exited();
        });
      });
    } else {
      this.log('CdkDrag not found', this.cdkDrag, this.dragRef);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dragConnectedIds) {
      if (this.dragRef.isDragging()) {
        // https://github.com/angular/material2/issues/15343
        setTimeout(() => {
          this.syncSiblings();
        });
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopDragging$.next();
    this.stopDragging$.complete();
    this.destroyAutoScroll();
  }

  started() {
    if (!this.scrollContainer) {
      return;
    }

    this.destroyAutoScroll();

    this.addDebugInfo();

    this.autoScroll = new AutoScroll(this.scrollContainer);

    this.lastScroll.top = this.scrollContainer.scrollTop;
    this.lastScroll.left = this.scrollContainer.scrollLeft;

    fromEvent(this.scrollContainer, 'scroll')
      .pipe(takeUntil(this.stopDragging$))
      .subscribe(() => {
        const deltaX = this.scrollContainer.scrollLeft - this.lastScroll.left;
        const deltaY = this.scrollContainer.scrollTop - this.lastScroll.top;

        if (deltaX || deltaY) {
          this.handleScroll(deltaX, deltaY);
        }

        this.lastScroll.top = this.scrollContainer.scrollTop;
        this.lastScroll.left = this.scrollContainer.scrollLeft;
      });

    this.dragRef.moved
      .pipe(
        debounceTime(10),
        takeUntil(this.stopDragging$)
      )
      .subscribe(e => {
        this.autoScroll.onMove(e.pointerPosition);
      });
  }

  ended() {
    this.destroyAutoScroll();
    this.stopDragging$.next();
    this.dragDebugService.reset();
  }

  entered() {
    this.dragFixContainer();
  }

  exited() {
    this.dragFixContainer();
  }

  private handleScroll(x: number, y: number) {
    const dropListRef: any = this.getDropListRef();

    // adjust containers
    this.adjustContainers();

    // adjust items
    this.adjustItems(x, y);

    // ToDo: better condition for changed items
    if (dropListRef._draggables.length > dropListRef._itemPositions.length) {
      this.syncItems();
    }

    this.addDebugInfo();
  }

  private destroyAutoScroll() {
    if (this.autoScroll) {
      this.autoScroll.destroy();
      this.autoScroll = null;
    }
  }

  private getDropListRef() {
    return this.dragRef['_dropContainer'];
  }

  private addDebugInfo() {
    if (!this.dragDebugService.enabled) {
      return;
    }
    const dropListRef: any = this.getDropListRef();
    const draws = [
      ...dropListRef._itemPositions.map(it => ({
        clientRect: it.clientRect,
        color: 'blue',
        id: it.drag.data.data.name
      })),
      ...dropListRef._siblings.map(it => ({
        clientRect: it._clientRect,
        color: 'green',
        id: ''
      })),
      {
        clientRect: dropListRef._clientRect,
        color: '#2FD1BB',
        id: ''
      }
    ];

    this.dragDebugService.log(draws.filter(d => d.clientRect));
  }

  private dragFixContainer() {
    // https://github.com/angular/material2/issues/15227
    setTimeout(() => {
      const dropListRef: any = this.getDropListRef();
      dropListRef._cacheOwnPosition();
      this.addDebugInfo();
    });

    // fix for issue when classes is not resetted
    this.changeDetectorRef.markForCheck();
  }

  private syncSiblings() {
    const dropListRef: any = this.getDropListRef();
    this.log('syncSiblings before', dropListRef._siblings.length);
    dropListRef.beforeStarted.next();
    this.log('syncSiblings after', dropListRef._siblings.length);
    this.adjustContainers();
  }

  private syncItems() {
    const dropListRef: any = this.getDropListRef();

    const oldPositions = dropListRef._itemPositions;
    dropListRef._activeDraggables = dropListRef._draggables.slice();

    dropListRef._cacheItemPositions();
    const newPositions = dropListRef._itemPositions;
    dropListRef._itemPositions = [...oldPositions];
    newPositions.forEach(p => {
      if (!oldPositions.find(p1 => p.drag === p1.drag)) {
        dropListRef._itemPositions.push(p);
      }
    });
    dropListRef._activeDraggables.push(this.dragRef);
  }

  private adjustContainers() {
    const dropListRef: any = this.getDropListRef();

    dropListRef._cacheOwnPosition();
    dropListRef._siblings.forEach(sibling => {
      sibling._cacheOwnPosition();
    });
  }

  private adjustItems(deltaX: number, deltaY: number) {
    const dropListRef: any = this.getDropListRef();
    dropListRef._itemPositions.forEach(it => {
      it.originalRect = it.originalRect || it.clientRect;
      it.clientRect = {
        ...it.clientRect,
        left: it.clientRect.left - deltaX,
        right: it.clientRect.right - deltaX,
        top: it.clientRect.top - deltaY,
        bottom: it.clientRect.bottom - deltaY
      };
    });
  }

  private log(message?: any, ...optionalParams: any[]) {
    if (this.dragDebugService.enabled) {
      console.log(message, optionalParams);
    }
  }
}
