import { Injectable } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import * as bcrypt from 'bcrypt';
import { ValidateUserDto } from './dto/validate.dto';

@Injectable()
export class AuthService {
  constructor(private readonly employeeService: EmployeeService) {}

  async validateUser(dto: ValidateUserDto): Promise<any> {
    const { username, password: pass } = dto;
    const user = await this.employeeService.findOne(username);

    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) return null;

    const { password, ...result } = user;
    return result;
  }
}
