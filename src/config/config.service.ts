import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get(key: string): string | undefined {
    return this.nestConfigService.get<string>(key);
  }

  getNumber(key: string): number | undefined {
    return this.nestConfigService.get<number>(key);
  }

  getDatabaseConfig() {
    return {
      host: this.get('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.get('DB_USER'),
      password: this.get('DB_PASS'),
      database: this.get('DB_NAME'),
    };
  }
}
