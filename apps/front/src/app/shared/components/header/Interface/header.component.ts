import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../../../../core/services/theme.service';
import { HeaderBrand, HeaderStep, HeaderUser } from './header.interface';
import { HeaderService } from '../Services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: '../header.component.html',
  styleUrls: ['../header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() activeStep = 0;
  @Output() stepSelected = new EventEmitter<number>();

  brand!: HeaderBrand;
  user!: HeaderUser;
  steps: MenuItem[] = [];

  hidden = false;

  constructor(
    private readonly headerService: HeaderService,
    private readonly theme: ThemeService,
  ) {}

  ngOnInit(): void {
    this.brand = this.headerService.getBrand();
    this.user = this.headerService.getCurrentUser();
    this.steps = this.headerService
      .getSteps()
      .map((step: HeaderStep) => ({ label: step.label, icon: step.icon }));

    this.theme.inicializar();
  }

  get dark(): boolean {
    return this.theme.oscuro;
  }

  toggleTheme(): void {
    this.theme.alternar();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.hidden = window.scrollY > 140;
  }

  onStepSelected(index: number): void {
    this.stepSelected.emit(index);
  }
}
