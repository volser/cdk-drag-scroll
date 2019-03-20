import { Component, OnInit, Input, Output, EventEmitter, 
ChangeDetectionStrategy, ChangeDetectorRef, NgZone,
OnChanges } from '@angular/core';

import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDropList,
  CdkDragStart,
  CdkDragEnd,
  DropListRef,
  CdkDrag
} from '@angular/cdk/drag-drop';
import { takeWhile, debounceTime, sampleTime, filter } from 'rxjs/operators';
import { AutoScroll } from '../auto-scroll';
import { fromEvent, timer  } from 'rxjs';

let activeDropContainer;

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyListComponent implements OnInit {

  @Input() items: any[];
  @Input() scrollContainer: HTMLElement;

  @Output() onDrop = new EventEmitter();
  @Output() onDraw = new EventEmitter();

  trackById = item => item.id;

  draging = false;
  autoScroll: AutoScroll;
  activeDrag: CdkDrag;

  constructor(private changeDetectorRef: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit() {
  }

  dragExited(event: CdkDragExit) {
    const dropListRef: any = event.container._dropListRef;
    // https://github.com/angular/material2/issues/15227
    setTimeout(()=>{
      dropListRef._cacheOwnPosition();
      this.drawRects();
    });
  }

  dragEntered(event: CdkDragEnter) {
    const dropListRef: any = event.container._dropListRef;
    // https://github.com/angular/material2/issues/15227
    setTimeout(()=>{
      dropListRef._cacheOwnPosition();
      this.drawRects();
    });
    activeDropContainer = event.container;
  }

  dragStarted(event: CdkDragStart) {
    this.draging = true;
    this.activeDrag = event.source;

    activeDropContainer = event.source.dropContainer;
    if (this.scrollContainer) {
      this.zone.runOutsideAngular(() => {
        if (this.autoScroll) {
          this.autoScroll.destroy();
          this.autoScroll = null;
        }
        this.autoScroll = new AutoScroll(
          this.scrollContainer,
          ({ x, y }: { x: number; y: number }) => {
            if (activeDropContainer) {
              const dropListRef: any = activeDropContainer._dropListRef;

              // https://github.com/angular/material2/issues/15343
              // ToDo: do not sync each scroll!
              this.syncSiblings();

              // adjust containers
              this.adjustContainers();
              // adjust items
              this.adjustItems(x, y);
              // ToDo: better condition for changed items
              if (dropListRef._draggables.length > dropListRef._itemPositions.length) {
                this.syncItems();
              }

              // draw rectungles for debug purpose
              this.drawRects();
            }
          }
        );

        this.activeDrag._dragRef.moved
          .pipe(
            debounceTime(10),
            takeWhile(_ => this.draging)
          )
          .subscribe(e => {
            this.autoScroll.onMove(e.pointerPosition);
          });

      });
    }
  }

  dragEnded(event: CdkDragEnd) {
    this.draging = false;
    if (this.autoScroll) {
      this.autoScroll.destroy();
      this.autoScroll = null;
    }
  }

  syncSiblings() {
    if (!activeDropContainer) {
      return;
    }
    activeDropContainer._dropListRef.beforeStarted.next();
  }

  syncItems() {
    if (!activeDropContainer) {
      return;
    }
    const dropListRef: any = activeDropContainer._dropListRef;
    
    /*dropListRef._activeDraggables = dropListRef._draggables.slice();
    dropListRef._activeDraggables.push(this.activeDrag._dragRef);
    dropListRef._cacheItemPositions();*/

    // ToDo: currently is working only if items were added to the end of list
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
    dropListRef._activeDraggables.push(this.activeDrag._dragRef);

  }

  adjustContainers() {
    if (!activeDropContainer) {
      return;
    }
    const dropListRef: any = activeDropContainer._dropListRef;

    dropListRef._cacheOwnPosition();
    dropListRef._siblings.forEach(sibling => {
      sibling._cacheOwnPosition();
    });

  }

  adjustItems(deltaX: number, deltaY: number) {
    const dropListRef: any = activeDropContainer._dropListRef;
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

  drawRects() {
    if (!activeDropContainer) {
      return;
    }
    const dropListRef: any = activeDropContainer._dropListRef;
    const draws = [ 
                ...dropListRef.
                _itemPositions.
                map(it => ({
                  clientRect: it.clientRect,
                  color: 'blue',
                  id: it.drag.data.data.id
                })),
                /*...dropContainer.
                _dropListRef.
                _itemPositions.
                map(it => ({
                  clientRect: it.originalRect,
                  color: 'green',
                  id: it.drag.data.data.id
                }))*/
                ...dropListRef._siblings
                .map(it => ({
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

              this.onDraw.emit(draws);
  }

}