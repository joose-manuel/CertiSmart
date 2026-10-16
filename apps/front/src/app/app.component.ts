import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

interface ApiInfo {
  name: string;
  version: string;
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'CertiSmart';
  apiInfo: ApiInfo | null = null;
  apiError = false;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ApiInfo>(`${environment.apiUrl}/`).subscribe({
      next: (info) => (this.apiInfo = info),
      error: () => (this.apiError = true),
    });
  }
}
