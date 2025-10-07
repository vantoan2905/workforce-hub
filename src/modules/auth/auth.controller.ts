import { Controller, Get, Post, Patch , UseGuards} from "@nestjs/common";
import { Body } from "@nestjs/common";
import { Request, Response } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ValidateUserDto } from "./dto/validate.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody } from "@nestjs/swagger";
import { LocalAuthGuard } from "./strategies/local-auth.guard";
// import {vali}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('validateUser')
    @ApiBody({ type: ValidateUserDto })
    // schema for request body

    validateUser(@Body() body: ValidateUserDto, @Request() req: any, @Response() res: any) {

        this.authService.validateUser(body);
        return { message: 'Validate user endpoint' };
    }

    @Post('register')
    register(@Body() body: any, @Request() req: any, @Response() res: any) {
        return { message: 'Register endpoint' };
    }
    @UseGuards(AuthGuard('local'))
    @Post('logout')
    logout(@Body() body: ValidateUserDto, @Request() req: any, @Response() res: any) {
        return { message: 'Logout endpoint' };
    }

    @Post('refresh-token')
    refreshToken(@Body() body: any, @Request() req: any, @Response() res: any) {
        return { message: 'Refresh token endpoint' };
    }

    @Get('verify-email')
    verifyEmail(@Body() body: any, @Request() req: any, @Response() res: any) {
        return { message: 'Verify email endpoint' };
    }

    @Post('reset-password')
    resetPassword(@Body() body: any, @Request() req: any, @Response() res: any) {
        return { message: 'Reset password endpoint' };
    }

    @Patch('change-password')
    changePassword(@Body() body: any, @Request() req: any, @Response() res: any) {
        return { message: 'Change password endpoint' };
    }

    @Get('profile')
    getProfile(@Request() req: any, @Response() res: any) {
        return { message: 'Get profile endpoint' };
    }

    @Get('roles')
    getRoles(@Request() req: any, @Response() res: any) {
        return { message: 'Get roles endpoint' };
    }
}
