import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsEmail, IsNotEmpty} from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({example: 'nsnda@example.com', description: 'Email address'})
    @IsString()
    @IsNotEmpty()
    email: string



    @ApiProperty({example: 'password123', description: 'Old Password'})
    @IsString()
    @IsNotEmpty()
    oldPassword: string


    @ApiProperty({example: 'password123', description: 'New Password'})
    @IsString()
    @IsNotEmpty()
    newPassword: string
}