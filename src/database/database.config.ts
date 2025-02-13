import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Load environment variables (for CLI tools)
dotenv.config();

const getDatabaseConfig = (
  configService?: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService
    ? configService.get<string>('DB_HOST')
    : process.env.DB_HOST,
  port: configService
    ? configService.get<number>('DB_PORT')
    : Number(process.env.DB_PORT),
  username: configService
    ? configService.get<string>('DB_USER')
    : process.env.DB_USER,
  password: configService
    ? configService.get<string>('DB_PASSWORD')
    : process.env.DB_PASSWORD,
  database: configService
    ? configService.get<string>('DB_NAME')
    : process.env.DB_NAME,
  synchronize: configService
    ? configService.get<boolean>('DB_SYNC')
    : process.env.DB_SYNC === 'true',
  logging: configService
    ? configService.get<boolean>('DB_LOGGING')
    : process.env.DB_LOGGING === 'true',
  migrationsTableName: 'migrations',
  migrations: ['dist/database/migrations/*.js'], // Use compiled JS files
  entities: ['dist/**/*.entity.js'], // Use compiled JS files
});

export const databaseConfig = getDatabaseConfig(); // Used for CLI tools

export const databaseConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => getDatabaseConfig(configService); // Used in NestJS DI

export const dataSource = new DataSource(databaseConfig); // Export TypeORM DataSource
