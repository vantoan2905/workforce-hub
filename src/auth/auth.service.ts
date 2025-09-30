import { Injectable, Inject, Scope } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor() {}

  async validateUser(email: string, password: string): Promise<any> {
    // logic to validate user
    return { email };
  }
  async login(user: any) {
    // logic to login user
    return {
      access_token: "some_access_token",
      refresh_token: "some_refresh_token",
    };
  }
  async refreshToken(token: string) {
    // logic to refresh token
    return {
      refresh_token: "some_refresh_token"
    };
  }
  async logout(user: any) {
    // logic to logout user
    return { message: "Logged out" };
  }

}