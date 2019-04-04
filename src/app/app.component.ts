import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DragDebugService } from 'cdk-drag-scroll';

interface Group {
  id: string;
  tasks: Task[];
}

interface Task {
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  groupId = 0;
  taskId = 0;

  groups: Group[] = [];

  trackById = item => item.id;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public dragDebugService: DragDebugService
  ) {
    this.dragDebugService.enabled = true;
  }

  ngOnInit() {
    this.fillGroups();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  fillGroups() {
    if (this.groups.length === 0) {
      this.groups.push(this.generateGroup(10));
      this.groups.push(this.generateGroup(5));
    } else {
      this.groups[this.groups.length - 1].tasks = [
        ...this.groups[this.groups.length - 1].tasks,
        ...this.generateTasks(5)
      ];
      this.groups.push(this.generateGroup(5));
    }
    this.changeDetectorRef.detectChanges();
    // console.log('groups', this.groups);
  }

  generateTask() {
    this.taskId++;
    const task = {
      id: String(this.taskId)
    };
    // console.log(task);
    return task;
  }

  generateTasks(count: number) {
    const tasks = Array(count)
      .fill(0)
      .map(_ => this.generateTask());
    // console.log(tasks);
    return tasks;
  }

  generateGroup(taskCount: number) {
    this.groupId++;
    return {
      id: String(this.groupId),
      tasks: this.generateTasks(taskCount)
    };
  }

  reset() {
    this.groupId = 0;
    this.taskId = 0;
    this.groups = [];
    this.fillGroups();
    this.dragDebugService.reset();
  }
}
