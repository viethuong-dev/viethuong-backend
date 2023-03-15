import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRefreshToken } from './UserRefreshToken';
import { Payload } from './Payload';
import { User } from '../user/User';
import { Token } from './Token';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(UserRefreshToken.name)
    private userRefreshTokenModel: Model<UserRefreshToken>,
  ) {}

  private readonly accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
  private readonly refreshTokenSecret: string =
    process.env.REFRESH_TOKEN_SECRET;
  private readonly accessTokenExpriesIn: number = 6 * 60 * 60; //6h
  private readonly refreshTokenExpriesIn: number = 30 * 24 * 60 * 60; //30d

  signJWT(payload, expire, key): string {
    const option: JwtSignOptions = {
      secret: key,
      algorithm: 'HS256',
      expiresIn: expire,
      issuer: 'backend-node',
    };
    return this.jwtService.sign(payload, option);
  }

  verifyAccessToken(token: string): Payload {
    const payload = this.jwtService.verify(token, {
      secret: this.accessTokenSecret,
    });
    return payload;
  }

  verifyRefreshToken(token: string): Payload {
    const payload = this.jwtService.verify(token, {
      secret: this.refreshTokenSecret,
    });
    return payload;
  }

  async generateToken(user: User): Promise<Token> {
    const payload: Payload = {
      username: user.username,
      userid: user._id.toHexString(),
      roles: user.roles,
    };
    return {
      access_token: this.signJWT(
        payload,
        this.accessTokenExpriesIn,
        this.accessTokenSecret,
      ),
      refresh_token: this.signJWT(
        payload,
        this.refreshTokenExpriesIn,
        this.refreshTokenSecret,
      ),
    };
  }

  async refreshToken(payload: Payload, refreshToken: string): Promise<Token> {
    const newPayload: Payload = { ...payload };
    delete newPayload.exp;
    delete newPayload.iat;
    delete newPayload.iss;
    return {
      access_token: this.signJWT(
        newPayload,
        this.accessTokenExpriesIn,
        this.accessTokenSecret,
      ),
      refresh_token: refreshToken,
    };
  }

  async createUserRefreshToken(
    refreshToken: string,
    userId: Types.ObjectId,
  ): Promise<UserRefreshToken> {
    const userRefreshToken: UserRefreshToken = {
      user_id: userId,
      refresh_token: refreshToken,
      expired_at: new Date(
        this.refreshTokenExpriesIn * 1000 + new Date().getTime(),
      ),
    };
    const result = await this.userRefreshTokenModel.create(userRefreshToken);
    return result;
  }

  async getUserRefreshToken(refreshToken: string): Promise<UserRefreshToken> {
    return this.userRefreshTokenModel.findOne({ refresh_token: refreshToken });
  }

  async deleteRefreshToken(refreshToken: string) {
    await this.userRefreshTokenModel.deleteOne({ refresh_token: refreshToken });
  }

  async deleteAllRefreshTokenByUserId(userId: string) {
    await this.userRefreshTokenModel.deleteMany({ user_id: userId });
  }
}
