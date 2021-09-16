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

## To publish npm package

- The version in the package.json in the project folder must be incremented
- On github, in Settings -> Developer settings -> Personal Access Tokens. Generate a new token with the privileges to write:packages.

- Run command with your username, token and email.
```
npm login --scope=@cactusoft-ca --registry=https://npm.pkg.github.com
```

In the project folder, run
```
ng build cdk-drag-scroll --configuration production
```

Finally, run from the dist/<project-name>
```
npm publish
```
