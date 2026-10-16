import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData() {
    return {
      name: 'CertiSmart API',
      version: '0.0.0',
      message: 'Welcome to the CertiSmart backend 🚀',
    };
  }
}
