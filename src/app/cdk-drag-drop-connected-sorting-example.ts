import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

interface Group  {
  id: string;
  tasks: Task[];
}

interface Task  {
  id: string;
}

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'cdk-drag-drop-connected-sorting-example',
  templateUrl: 'cdk-drag-drop-connected-sorting-example.html',
  styleUrls: ['cdk-drag-drop-connected-sorting-example.css'],
})
export class CdkDragDropConnectedSortingExample implements OnInit {
  groupId =0;
  taskId = 0;

  groups: Group[] = [
    
  ];

  trackById = item => item.id;

  draws: {
    id: string;
    color: string;
    clientRect: ClientRect;
  }[];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this.fillGroups();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  fillGroups() {
    if (this.groups.length === 0) {
      this.groups.push(
        this.generateGroup(10)
      );
      this.groups.push(
        this.generateGroup(5)
      ); 
    } else {
      this.groups[this.groups.length - 1].tasks = [
        ...this.groups[this.groups.length - 1].tasks,
        ...this.generateTasks(5)
      ];
      this.groups.push(
        this.generateGroup(5)
      ); 
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
    const tasks = Array(count).fill(0).map(_ => this.generateTask());
    // console.log(tasks);
    return tasks;
    
  }

  generateGroup(taskCount: number) {
    this.groupId++;
    return {
      id: String(this.groupId),
      tasks: this.generateTasks(taskCount)
    }
  }

  reset() {
    this.groupId = 0;
    this.taskId = 0;
    this.groups = [];
    this.fillGroups();
    this.draws = [];
  }

  drawRect(event) {
    this.draws = event;
    //console.log('draw', this.draws);
    this.changeDetectorRef.markForCheck();
  }
}
