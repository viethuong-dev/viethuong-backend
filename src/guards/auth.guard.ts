import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/biz/auth/auth.service';
import { BaseGuard } from './base.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard extends BaseGuard {
    constructor(
        protected reflector: Reflector,
        private jwtService: AuthService,
    ) {
        super(reflector);
    }
    async canActivate(context: ExecutionContext): Promise<any> {
        try {
            if (this.isPublic(context)) {
                return true;
            }
            const request = context.switchToHttp().getRequest();
            const authorization: string = request.headers['authorization'];
            const authorizationSplit = authorization.split(' ');
            if (authorizationSplit[0] == 'Bearer') {
                const payload = this.jwtService.verifyAccessToken(
                    authorizationSplit[1],
                );
                request.user = payload;
                return true;
            }
            throw new UnauthorizedException();
        } catch {
            throw new UnauthorizedException();
        }
    }
}
