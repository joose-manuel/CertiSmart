import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

const TOTAL_ATTEMPTS = 32;
const RETRY_MS = 1000;

@Injectable({ providedIn: 'root' })
export class BackendReadyService {
  private http = inject(HttpClient);

  readonly progress = signal(5);
  readonly ready = signal(false);
  readonly offline = signal(false);

  private attempts = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  waitForBackend(): void {
    if (this.ready()) {
      return;
    }
    this.attempts = 0;
    this.progress.set(5);
    this.offline.set(false);
    this.ping();
  }

  reset(): void {
    this.ready.set(false);
    this.offline.set(false);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.waitForBackend();
  }

  private ping(): void {
    if (this.ready()) {
      return;
    }
    this.attempts = Math.min(this.attempts + 1, TOTAL_ATTEMPTS);
    const carga = Math.min(95, 5 + Math.round((this.attempts / TOTAL_ATTEMPTS) * 90));
    this.progress.set(carga);

    this.http.get(`${environment.apiUrl}/health`).subscribe({
      next: () => {
        this.progress.set(100);
        this.ready.set(true);
      },
      error: () => {
        if (this.attempts < TOTAL_ATTEMPTS) {
          this.timer = setTimeout(() => this.ping(), RETRY_MS);
        } else {
          this.progress.set(100);
          this.offline.set(true);
          this.ready.set(true);
        }
      },
    });
  }
}
