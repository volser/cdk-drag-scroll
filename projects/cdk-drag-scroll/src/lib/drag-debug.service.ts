import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DragDebugService {
  debugInfo = new BehaviorSubject<any[]>(null);
  enabled = false;

  constructor() {}

  log(info: any[]) {
    this.debugInfo.next(info);
  }

  reset() {
    this.debugInfo.next(null);
  }
}
