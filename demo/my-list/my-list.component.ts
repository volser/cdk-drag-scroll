import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyListComponent implements OnInit {
  @Input() items: any[];
  @Input() scrollContainer: HTMLElement;

  trackById = item => item.id;

  constructor() {}

  ngOnInit() {}
}
