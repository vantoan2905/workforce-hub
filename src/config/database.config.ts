import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Auth } from '../modules/auth/entities/auth.entity';

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '29052003',
    database: process.env.POSTGRES_DB || 'workforce_hub',
    entities: [Auth],
    synchronize: true, // set to false in production
    autoLoadEntities: true,
  }),
);
