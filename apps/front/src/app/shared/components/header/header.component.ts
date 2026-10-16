import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HeaderBrand, HeaderStep, HeaderUser } from './header.interface';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() activeStep = 0;
  @Output() stepSelected = new EventEmitter<number>();

  brand!: HeaderBrand;
  user!: HeaderUser;
  steps: MenuItem[] = [];

  dark = false;
  hidden = false;

  constructor(private readonly headerService: HeaderService) {}

  ngOnInit(): void {
    this.brand = this.headerService.getBrand();
    this.user = this.headerService.getCurrentUser();
    this.steps = this.headerService
      .getSteps()
      .map((step: HeaderStep) => ({ label: step.label, icon: step.icon }));

    const stored = localStorage.getItem('certismart-theme');
    this.dark =
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.applyTheme();
  }

  toggleTheme(): void {
    this.dark = !this.dark;
    this.applyTheme();
    localStorage.setItem('certismart-theme', this.dark ? 'dark' : 'light');
  }

  private applyTheme(): void {
    document.documentElement.dataset['theme'] = this.dark ? 'dark' : 'light';
    document.documentElement.classList.toggle('theme-dark', this.dark);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.hidden = window.scrollY > 140;
  }

  onStepSelected(index: number): void {
    this.stepSelected.emit(index);
  }
}
