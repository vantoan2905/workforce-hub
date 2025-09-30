import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthService } from './auth/auth.service';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, EmployeeModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
