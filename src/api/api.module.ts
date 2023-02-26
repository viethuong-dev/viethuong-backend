import { Module } from '@nestjs/common';
import { BizModule } from 'src/biz/biz.module';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { ConstantController } from './cte/cte.controller';

@Module({
  imports: [BizModule],
  controllers: [UserController, AuthController, ConstantController],
})
export class ApiModule {}
