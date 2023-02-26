import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/biz/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization: string = request.headers['authorization'];
      const authorizationSplit = authorization.split(' ');
      if (authorizationSplit[0] == 'Bearer') {
        const payload = this.jwtService.verifyAccessToken(authorizationSplit[1]);
        request.user = payload;
        return true;
      }
      throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
