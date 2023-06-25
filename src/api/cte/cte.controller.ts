import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleInfo } from 'src/constants/role.enum';
import { UserStatusInfo } from 'src/constants/userstatus.enum';

@ApiTags('cte')
@Controller('cte')
export class ConstantController {
    @Get('roles')
    async getCteUserRoles() {
        return RoleInfo;
    }

    @Get('user-status')
    async getCteUserStatus() {
        return UserStatusInfo;
    }
}
