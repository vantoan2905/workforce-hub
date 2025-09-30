import { Controller, Get, Post, Patch } from "@nestjs/common";

@Controller('employee')
export class EmployeeController {
    @Post('create')
    createEmployee() {
        return { message: 'Create employee endpoint' };
    }

    @Patch('update')
    updateEmployee() {
        return { message: 'Update employee endpoint' };
    }

    @Get('get')
    getEmployee() {
        return { message: 'Get employee endpoint' };
    }
    @Post('delete')
    deleteEmployee() {
        return { message: 'Delete employee endpoint' };
    }
}