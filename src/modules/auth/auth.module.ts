import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { EmployeeModule } from "../employee/employee.module";
import { LocalStrategy } from "./strategies/jwt.strategy";
@Module({
  imports: [EmployeeModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}