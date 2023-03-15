import { Module } from '@nestjs/common';
import { BizModule } from 'src/biz/biz.module';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { ConstantController } from './cte/cte.controller';
import { PostController } from './post/post.controller';

@Module({
  imports: [BizModule],
  controllers: [
    UserController,
    AuthController,
    ConstantController,
    PostController,
  ],
})
export class ApiModule {}
