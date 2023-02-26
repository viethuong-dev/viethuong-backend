import { Controller, Get } from '@nestjs/common';
import { RoleInfo } from 'src/constants/role.enum';
import { UserStatusInfo } from 'src/constants/userstatus.enum';

@Controller('cte')
export class ConstantController {
  @Get('roles')
  async getCteUserRoles() {
    return RoleInfo;
  }

  @Get('user_status')
  async getCteUserStatus() {
    return UserStatusInfo;
  }
}
