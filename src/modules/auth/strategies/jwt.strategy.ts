import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ValidateUserDto } from "../dto/validate.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "username" }); // Adjust if using email or other field
  }

  async validate(dto: ValidateUserDto): Promise<any> {
    const user = await this.authService.validateUser(dto);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}