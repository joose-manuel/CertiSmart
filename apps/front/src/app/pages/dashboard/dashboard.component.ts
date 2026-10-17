import { Component } from '@angular/core';

import { BackendReadyService } from '../../core/services/backend-ready.service';
import { DASHBOARD_TITLE } from './dashboard.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  readonly title = DASHBOARD_TITLE;
  activeStep = 0;

  constructor(private readonly backend: BackendReadyService) {}

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