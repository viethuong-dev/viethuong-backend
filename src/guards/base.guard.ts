import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export abstract class BaseGuard implements CanActivate {
    constructor(protected reflector: Reflector) {}

    abstract canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean>;

    isPublic(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );
        return !!isPublic;
    }
}
