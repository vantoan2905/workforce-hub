import { Module } from "@nestjs/common";
import { LocalStrategy } from "./strategies/jwt.strategy";
import {TypeOrmModule} from '@nestjs/typeorm';
// services
import { AuthService } from "./auth.service";
// modules
import { JwtModule } from '@nestjs/jwt';
import { EmployeeModule } from "../employee/employee.module";
// controllers
import { AuthController } from "./auth.controller";
// entities
import {Auth} from './entities/auth.entity';
import { Employee } from "../employee/entities/employee.entities";
import { BlackList } from "./entities/blackList.entities";


@Module({
  imports: [
    EmployeeModule, 
    TypeOrmModule.forFeature([Auth, Employee, BlackList]),
        JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
     LocalStrategy
  ],

})
export class AuthModule {}