import { hashSync, compareSync, genSaltSync } from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { User } from './User';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { CreateUserDTO } from 'src/api/user/user.dto';
import { Role } from 'src/constants/role.enum';
import { USER_STATUS } from 'src/constants/userstatus.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username: username });
  }

  async findById(userid: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(userid);
      return user;
    } catch (error) {
      return null;
    }
  }

  hashPassword(password: string, salt: string): string {
    return hashSync(password, salt);
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<User | Error> {
    const user = await this.findByUsername(username);
    if (!user) return new Error('user not found');
    if (user.status !== USER_STATUS.ACTIVATED)
      return new Error('user is not activated');
    const isMatch = compareSync(password, user.hashed_password);
    if (!isMatch) return new Error('Password is incorrect');
    return user;
  }

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const salt = genSaltSync();
    const hashedPassword = this.hashPassword(createUserDto.password, salt);
    const user: User = {
      username: createUserDto.username,
      fullname: createUserDto.fullname,
      hashed_password: hashedPassword,
      salt: salt,
      roles: createUserDto.roles,
      status: USER_STATUS.ACTIVATED,
    };
    return this.userModel.create(user);
  }

  async updateUser(
    userId: string,
    updateQuery: UpdateQuery<User>,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateQuery, { new: true });
  }

  async resetPasswordUser(userId: string, password: string) {
    const salt = genSaltSync();
    console.log(salt);
    console.log(password);

    const hashedPassword = this.hashPassword(password, salt);
    await this.updateUser(userId, {
      salt: salt,
      hashed_password: hashedPassword,
    });
  }

  async findUsers(
    offset: number,
    limit: number,
    status: USER_STATUS,
  ): Promise<User[]> {
    const query: FilterQuery<User> = {};
    if (status) {
      query.status = status;
    }
    return this.userModel.find(query).skip(offset).limit(limit);
  }

  async countUsers(status: USER_STATUS): Promise<number> {
    const query: FilterQuery<User> = {};
    if (status) {
      query.status = status;
    }
    return this.userModel.count(query);
  }
}
