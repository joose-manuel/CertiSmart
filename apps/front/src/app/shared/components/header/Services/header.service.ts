import { Injectable } from '@angular/core';
import {
  HEADER_BRAND,
  HEADER_CURRENT_USER,
  HEADER_STEPS,
} from '../const/header.constants';
import { HeaderBrand, HeaderStep, HeaderUser } from '../Interface/header.interface';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  getBrand(): HeaderBrand {
    return { ...HEADER_BRAND };
  }

  getSteps(): HeaderStep[] {
    return HEADER_STEPS.map((step) => ({ ...step }));
  }

  getCurrentUser(): HeaderUser {
    return { ...HEADER_CURRENT_USER };
  }
}
