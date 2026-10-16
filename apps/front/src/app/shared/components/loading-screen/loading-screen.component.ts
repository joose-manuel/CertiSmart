import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css'],
})
export class LoadingScreenComponent {
  @Input() progress = 60;
  @Input() offline = false;
  @Output() retry = new EventEmitter<void>();
}
