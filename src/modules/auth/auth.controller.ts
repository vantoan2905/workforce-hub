import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';


import { 
  ApiBody,
  ApiResponse, 
  ApiTags, 
  ApiConsumes 
} from '@nestjs/swagger';

// services
import { AuthService } from './auth.service';
// dto
import { ValidateUserDto } from './dto/validate.dto';
import { RegisterUserDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** =======================
   * 🧩 REGISTER USER
   * ======================= */
  @Post('register')
  @ApiBody({
    type: RegisterUserDto,
    description: 'Register a new user (Employee or Manager)',
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    const createdUser = await this.authService.registerUser(registerUserDto);
    return {
      message: 'User registered successfully',
      user: createdUser,
    };
  }

  /** =======================
   * 🔑 LOGIN
   * ======================= */
  // @UseGuards(AuthGuard('local'))
  @Post('validate')
  @ApiBody({
    type: ValidateUserDto,
    description: 'Login with username and password to receive tokens',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async validateUser(@Body() dto: ValidateUserDto) {
    const user = await this.authService.getProfile(dto);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    await this.authService.saveRefreshToken(user.id, refreshToken);

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  /** =======================
   * 🔁 REFRESH TOKEN
   * ======================= */
  @UseGuards(AuthGuard('local'))
  @Post('refresh-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(@Body() dto: { refresh_token: string }) {
    const { refresh_token } = dto;
    const isValid = await this.authService.isValidRefreshToken(refresh_token);
    if (!isValid) throw new UnauthorizedException('Invalid or expired token');

    const tokens = await this.authService.refreshTokens(refresh_token);
    return {
      message: 'Token refreshed successfully',
      ...tokens,
    };
  }

  /** =======================
   * 🚫 LOGOUT
   * ======================= */
  @UseGuards(AuthGuard('local'))
  @Post('logout')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
      required: ['refresh_token'],
    },
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Body() dto: { refresh_token: string }) {
    const { refresh_token } = dto;
    if (!refresh_token) throw new BadRequestException('Refresh token is required');

    await this.authService.logout(refresh_token);
    return { message: 'Logged out successfully' };
  }

  /** =======================
   * 🔐 CHANGE PASSWORD
   * ======================= */
  @UseGuards(AuthGuard('local'))
  @Patch('change-password')
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Change user password',
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  async changePassword(@Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(dto);
    return { message: 'Password changed successfully' };
  }

  // /** =======================
  //  * 👤 PROFILE
  //  * ======================= */
  // @UseGuards(AuthGuard('local'))
  // @Get('me')
  // @ApiResponse({ status: 200, description: 'User profile data' })
  // @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async getProfile(@Request() req) {
  //   const user = await this.authService.getProfile(req.user);
  //   return {
  //     message: 'User profile data',
  //     user,
  //   };
  // }
}
