import './polyfills';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CdkDragDropConnectedSortingExample } from './app/cdk-drag-drop-connected-sorting-example';
import { MyListComponent } from './app/my-list/my-list.component';
import { ScrollDetectorDirective } from './app/scroll-detector.directive';
import { DemoMaterialModule } from './material-module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  entryComponents: [CdkDragDropConnectedSortingExample, MyListComponent],
  declarations: [
    CdkDragDropConnectedSortingExample,
    MyListComponent,
    ScrollDetectorDirective
  ],
  bootstrap: [CdkDragDropConnectedSortingExample],
  providers: []
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
