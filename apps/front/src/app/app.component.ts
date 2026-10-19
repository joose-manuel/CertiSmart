import { Component, OnInit } from '@angular/core';

import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private readonly theme: ThemeService) {}

  /** Aplica el tema guardado antes de pintar cualquier módulo del shell. */
  ngOnInit(): void {
    this.theme.inicializar();
  }
}
