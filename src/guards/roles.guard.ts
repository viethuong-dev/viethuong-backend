import {
    Injectable,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Role } from 'src/constants/role.enum';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { BaseGuard } from './base.guard';

@Injectable()
export class RolesGuard extends BaseGuard {
    // constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        if (this.isPublic(context)) {
            return true;
        }
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const isValidRoles = requiredRoles.some((role) =>
            user.roles?.includes(role),
        );
        if (isValidRoles) {
            return true;
        } else {
            throw new ForbiddenException('invalid roles');
        }
    }
}
