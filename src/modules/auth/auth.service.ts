import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { HashUtil } from 'src/common/utils/hash.util';
import { EncryptUtil } from 'src/common/utils/encrypt.utils';
import { JwtService } from '@nestjs/jwt';

// services
import { EmployeeService } from '../employee/employee.service';

// dto
import { ValidateUserDto } from './dto/validate.dto';

// entities
import { Auth } from './entities/auth.entity';
import { Employee } from '../employee/entities/employee.entities';
import { BlackList } from '../auth/entities/blackList.entities';

// custom exceptions
import { CustomHttpException } from 'src/common/exceptions/custom-http.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeeService: EmployeeService,

    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(BlackList)
    private readonly blackListRepository: Repository<BlackList>,

    private readonly jwtService: JwtService,
  ) {}

  /** =======================
   * 🧩 REGISTER USER
   * ======================= */
  async registerUser(dto: any): Promise<any> {
    try {
      const {
        username,
        password,
        email,
        firstName,
        lastName,
        phoneNumber,
        role,
        address,
        dateOfBirth,
      } = dto;

      if (!username || !password || !email) {
        throw new CustomHttpException('Missing required fields', HttpStatus.BAD_REQUEST);
      }

      const existingUser = await this.employeeRepository.findOne({ where: { username } });
      if (existingUser) {
        throw new CustomHttpException('Username already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword = await HashUtil.hashPassword(password);
      const encryptedAddress = EncryptUtil.encrypt(address);
      const encryptedPhone = EncryptUtil.encrypt(phoneNumber);

      const newUser = this.employeeRepository.create({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        phoneNumber: encryptedPhone,
        role,
        address: encryptedAddress,
        dateOfBirth,
      });

      await this.employeeRepository.save(newUser);

      return {
        message: 'User registered successfully',
        userId: newUser.employeeId,
      };
    } catch (error) {
      if (error instanceof CustomHttpException) throw error;
      throw new CustomHttpException('Failed to register user', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  /** =======================
   * 🔑 VALIDATE USER (LOGIN)
   * ======================= */
  async validateUser(dto: ValidateUserDto): Promise<any> {
    try {
      const { username, password } = dto;

      if (!username || !password) {
        throw new CustomHttpException('Username and password are required', HttpStatus.BAD_REQUEST);
      }

      const user = await this.employeeService.findOne(username);
      if (!user) {
        throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new CustomHttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      return {
        id: user.employeeId,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof CustomHttpException) throw error;
      throw new CustomHttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  /** =======================
   * 🔐 TOKEN GENERATION
   * ======================= */
  async generateAccessToken(payload: any): Promise<string> {
    try {
      if (!payload || typeof payload !== 'object') {
        throw new CustomHttpException('Invalid token payload', HttpStatus.BAD_REQUEST);
      }

      return this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      });
    } catch (error) {
      throw new CustomHttpException('Failed to generate access token', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async generateRefreshToken(payload: any): Promise<string> {
    try {
      return this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });
    } catch (error) {
      throw new CustomHttpException('Failed to generate refresh token', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  /** =======================
   * 💾 SAVE / VERIFY REFRESH TOKEN
   * ======================= */
  async saveRefreshToken(employeeId: number, refreshToken: string): Promise<void> {
    try {
      if (!employeeId) {
        throw new CustomHttpException('Missing employeeId in saveRefreshToken', HttpStatus.BAD_REQUEST);
      }

      const hashedToken = await HashUtil.hashPassword(refreshToken);
      await this.authRepository.update({ employeeId }, { refreshToken: hashedToken });
    } catch (error) {
      if (error instanceof CustomHttpException) throw error;
      throw new CustomHttpException('Failed to save refresh token', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  async isValidRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.authRepository.findOne({ where: { employeeId: payload.sub } });
      if (!user?.refreshToken) return false;

      return await HashUtil.comparePassword(refreshToken, user.refreshToken);
    } catch {
      return false;
    }
  }

  /** =======================
   * 🔁 REFRESH TOKEN FLOW
   * ======================= */
  async refreshTokens(refreshToken: string) {
    try {
      let payload: any;

      try {
        payload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_REFRESH_SECRET,
        });
      } catch {
        throw new CustomHttpException('Invalid or expired refresh token', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.employeeRepository.findOne({ where: { employeeId: payload.sub } });
      if (!user) {
        throw new CustomHttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      const isValid = await this.isValidRefreshToken(refreshToken);
      if (!isValid) {
        throw new CustomHttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      }

      const newPayload = { sub: user.employeeId, username: user.username };
      const newAccessToken = await this.generateAccessToken(newPayload);
      const newRefreshToken = await this.generateRefreshToken(newPayload);

      await this.saveRefreshToken(user.employeeId, newRefreshToken);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof CustomHttpException) throw error;
      throw new CustomHttpException('Failed to refresh tokens', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  /** =======================
   * 🚫 BLACKLIST TOKEN
   * ====================== */
  async addBlacklistToken(token: string, employeeId: number): Promise<void> {
    try {
      await this.blackListRepository.save({
        employeeId,
        token,
        createdAt: new Date(),
      });
    } catch (error) {
      throw new CustomHttpException('Failed to add blacklist token', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  /** =======================
   * 🚪 LOGOUT
   * ======================= */
  async logout(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new CustomHttpException('Refresh token required', HttpStatus.BAD_REQUEST);
      }

      const payload: any = this.jwtService.decode(refreshToken);
      if (!payload?.sub) {
        throw new CustomHttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      }

      await this.addBlacklistToken(refreshToken, payload.sub);
      return { message: 'Logged out successfully' };
    } catch (error) {
      if (error instanceof CustomHttpException) throw error;
      throw new CustomHttpException('Logout failed', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  /** =======================
   * 🔑 CHANGE PASSWORD
   * ======================= */
  async changePassword(dto: any): Promise<void> {
    try {
      const { employeeId, oldPassword, newPassword } = dto;

      const user = await this.employeeRepository.findOne({ where: { employeeId } });
      if (!user) {
        throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new CustomHttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
      }

      const hashedNewPassword = await HashUtil.hashPassword(newPassword);
      await this.employeeRepository.update(employeeId, { password: hashedNewPassword });
    } catch (error) {
      if (error instanceof CustomHttpException) throw error;
      throw new CustomHttpException('Failed to change password', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  /** =======================
   * 👤 GET PROFILE
   * ======================= */
  async getProfile(dto: any): Promise<any> {
    try {
      const { username } = dto;
      if (!username) {
        throw new CustomHttpException('Username is required', HttpStatus.BAD_REQUEST);
      }

      const employee = await this.employeeRepository.findOne({ where: { username } });
      if (!employee) {
        throw new CustomHttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        id: employee.employeeId,
        username: employee.username,
        email: employee.email,
        role: employee.role,
        isActive: employee.isActive,
      };
    } catch (error) {
      if (error instanceof CustomHttpException) throw error;
      throw new CustomHttpException('Failed to get profile', HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
}
