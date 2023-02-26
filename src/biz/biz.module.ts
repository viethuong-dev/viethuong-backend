import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/User';
import { AuthService } from './auth/auth.service';
import { UserRefreshToken, UserRefreshTokenSchema } from './auth/UserRefreshToken';
import { JwtModule, JwtService } from '@nestjs/jwt';

const dbModules = [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), MongooseModule.forFeature([{ name: UserRefreshToken.name, schema: UserRefreshTokenSchema }])];
const services = [UserService, AuthService, JwtService];

@Module({
  imports: [...dbModules],
  providers: [...services],
  exports: services,
})
export class BizModule {}
