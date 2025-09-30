import { Controller, Get, Post, Patch } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Body } from "@nestjs/common";
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('validateUser')
    validateUser() {
        return { message: 'Validate user endpoint' };
    }

    @Post('register')
    register() {
        return { message: 'Register endpoint' };
    }

    @Post('logout')
    logout() {
        return { message: 'Logout endpoint' };
    }

    @Post('refresh-token')
    refreshToken() {
        return { message: 'Refresh token endpoint' };
    }

    @Get('verify-email')
    verifyEmail() {
        return { message: 'Verify email endpoint' };
    }

    @Post('reset-password')
    resetPassword() {
        return { message: 'Reset password endpoint' };
    }

    @Patch('change-password')
    changePassword() {
        return { message: 'Change password endpoint' };
    }

    @Get('profile')
    getProfile() {
        return { message: 'Get profile endpoint' };
    }

    @Get('roles')
    getRoles() {
        return { message: 'Get roles endpoint' };
    }
}
