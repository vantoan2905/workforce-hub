import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNotEmpty} from 'class-validator';
export class ValidateUserDto {
    @ApiProperty({example: 'john_doe', description: 'Login account'})
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @ApiProperty({example: 'password123', description: 'Password'})
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @ApiProperty({example: 'john_doe@example.com', description: 'Email address'})
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example: 'John', description: 'First name'})
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({example: 'Doe', description: 'Last name'})
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({example: '1234567890', description: 'Phone number'})
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @ApiProperty({example: 'USER', description: 'Role'})
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({example: '123 Main Street', description: 'Address'})
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({example: '1990-01-01', description: 'Date of Birth'})
    @IsString()
    @IsNotEmpty()
    dateOfBirth: string;


    @ApiProperty({example: '1', description: 'admin_role'})
    @IsString()
    @IsNotEmpty()
    admin_role: string;

    
}