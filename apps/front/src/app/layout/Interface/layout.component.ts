import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { TOPBAR_TITULO_DEFECTO } from '../components/topbar/const/topbar.constants';
import { LayoutService } from '../Services/layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: '../layout.component.html',
  styleUrls: ['../layout.component.css'],
})
export class LayoutComponent implements OnInit {
  readonly titulo = signal(TOPBAR_TITULO_DEFECTO);

  constructor(
    readonly layout: LayoutService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.titulo.set(this.layout.tituloDe(this.router.url));

    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe((evento) => {
        const url = (evento as NavigationEnd).urlAfterRedirects;
        this.titulo.set(this.layout.tituloDe(url));
        this.layout.cerrarMenuMovil();
      });
  }
}
