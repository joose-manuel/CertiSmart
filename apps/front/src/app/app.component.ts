import { Component, OnInit } from '@angular/core';
import { BackendReadyService } from './core/services/backend-ready.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  activeStep = 0;

  constructor(private readonly backend: BackendReadyService) {}

  ngOnInit(): void {
    this.backend.waitForBackend();
  }

  get ready(): boolean {
    return this.backend.ready();
  }

  get progress(): number {
    return this.backend.progress();
  }

  get offline(): boolean {
    return this.backend.offline();
  }

  onStepSelected(step: number): void {
    this.activeStep = step;
  }

  onRetry(): void {
    this.backend.reset();
  }
}
