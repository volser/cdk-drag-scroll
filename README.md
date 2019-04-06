# Cdk Drag Scroll

## Demo

https://cdk-drag-scroll-demo.stackblitz.io/

## Installation

Install through npm:

```
npm install --save cdk-drag-scroll

```

Then use it in your app like so:

```html

<div
  *ngFor="let item of items"
   cdkDrag
   vsDragScroll
   [vsDragScrollContainer]="scrollContainer"
   [cdkDragData]="item">
   ...
</div>

```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
