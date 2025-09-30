// dto for login
import { IsEmail, IsNotEmpty } from "class-validator";

export class AuthValidationDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class AuthRegisterDto {
  @IsEmail()
  email: string
  @IsNotEmpty()
  password: string
  @IsNotEmpty()
  firstName: string
  @IsNotEmpty()
  lastName: string;

  phoneNumber?: string;
  role?: string;
  isActive?: boolean;

  createdBy?: string;
  updatedBy?: string;
}

export class AuthChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;
  @IsNotEmpty()
  newPassword: string;
}

export class AuthResetPasswordDto {
  @IsEmail()
  email: string;
}
export class AuthRefreshTokenDto {
  @IsNotEmpty()
  refreshToken: string;
}
