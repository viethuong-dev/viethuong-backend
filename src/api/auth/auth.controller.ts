import { Body, Controller, ForbiddenException, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Payload } from 'src/biz/auth/Payload';
import { AuthService } from 'src/biz/auth/auth.service';
import { UserService } from 'src/biz/user/user.service';
import { AuthUser } from 'src/decorators/authuser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Post('/login')
  async login(@Body('username') username: string, @Body('password') password: string) {
    const user = await this.userService.validatePassword(username, password);
    if (user instanceof Error) {
      throw new UnauthorizedException(user.message);
    }
    const token = await this.authService.generateToken(user);
    await this.authService.createUserRefreshToken(token.refresh_token, user._id);
    return token;
  }

  @Post('/refresh-token')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    const payload = this.authService.verifyRefreshToken(refreshToken);
    const savedUserRefreshToken = await this.authService.getUserRefreshToken(refreshToken);
    if (!savedUserRefreshToken) {
      throw new ForbiddenException('refresh_token not found');
    }
    const token = await this.authService.refreshToken(payload, refreshToken);
    return token;
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  async logout(@AuthUser() authUser: Payload, @Body('refresh_token') refreshToken: string) {
    const savedUserRefreshToken = await this.authService.getUserRefreshToken(refreshToken);
    if (!savedUserRefreshToken || savedUserRefreshToken.user_id.toHexString() !== authUser.userid) {
      throw new ForbiddenException('refresh_token not found');
    }
    await this.authService.deleteRefreshToken(refreshToken);
    return {};
  }
}
