import { Injectable, Logger } from "@nestjs/common";
import { Employee } from "./entities/employee.entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findOne(username: string): Promise<Employee | null> {
    try {
      return await this.employeeRepository.findOne({ where: { username } });
    } catch (error) {
      this.logger.error(`Error fetching employee with username=${username}`, error.stack);
      throw error;
    }
  }
}
