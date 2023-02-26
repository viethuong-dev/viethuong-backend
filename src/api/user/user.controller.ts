import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateUserDTO, ResetPasswordDTO, UpdateUserDTO, UserActionDTO, UserDTO, UsersDTO, tranformUserModelToDTO } from './user.dto';
import { AuthUser } from 'src/decorators/authuser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/biz/user/user.service';
import { Payload } from 'src/biz/auth/Payload';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/constants/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { USER_STATUS } from 'src/constants/userstatus.enum';
import { AuthService } from 'src/biz/auth/auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/util/pagination';

@ApiTags('user')
@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) {}

  @ApiOkResponse({
    type: UserDTO,
    isArray: false,
  })
  @Post('/create')
  @Roles(Role.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDTO) {
    const existedUser = await this.userService.findByUsername(createUserDto.username);
    if (existedUser) {
      throw new BadRequestException('username existed');
    }
    const user = await this.userService.createUser(createUserDto);
    const userDTO = tranformUserModelToDTO(user);
    return userDTO;
  }

  @ApiOkResponse({
    type: UsersDTO,
    isArray: false,
  })
  @Get('/')
  @Roles(Role.ADMIN)
  async getUsers(@Query() paginationQuery: PaginationQuery, @Query('status') status?: USER_STATUS) {
    const offset = paginationQuery.offset || 0;
    const limit = paginationQuery.limit || 20;
    const [users, total] = await Promise.all([this.userService.findUsers(offset, limit, status), this.userService.countUsers(status)]);
    const userDtos = users.map((user) => tranformUserModelToDTO(user));
    return {
      users: userDtos,
      total,
    };
  }

  @ApiOkResponse({
    type: UserDTO,
    isArray: false,
  })
  @Get('/me')
  @UseGuards(AuthGuard)
  async getProfile(@AuthUser() authUser: Payload) {
    const user = await this.userService.findByUsername(authUser.username);
    return tranformUserModelToDTO(user);
  }

  @ApiOkResponse({
    type: UserDTO,
    isArray: false,
  })
  @Get('/:userid')
  @Roles(Role.ADMIN)
  async getUser(@Param('userid') userid: string) {
    const user = await this.userService.findById(userid);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const userDTO = tranformUserModelToDTO(user);
    return userDTO;
  }

  @ApiOkResponse({
    type: UserDTO,
    isArray: false,
  })
  @Post('/:userid/action')
  @Roles(Role.ADMIN)
  async changeUserStatus(@Body() userActionDTO: UserActionDTO, @Param('userid') userid: string) {
    const existedUser = await this.userService.findById(userid);
    if (!existedUser) {
      throw new NotFoundException('user not found');
    }
    const newStatus = userActionDTO.status;
    const userDTO = tranformUserModelToDTO(existedUser);
    if (existedUser.status === newStatus) {
      return userDTO;
    }
    if (newStatus === USER_STATUS.DEACTIVATED) {
      await this.authService.deleteAllRefreshTokenByUserId(userid);
    }
    const updatedUser = await this.userService.updateUser(userid, { status: newStatus });
    return tranformUserModelToDTO(updatedUser);
  }

  @ApiOkResponse({
    type: UserDTO,
    isArray: false,
  })
  @Post('/:userid/update')
  @Roles(Role.ADMIN)
  async updateUserInfo(@Body() updateUserDTO: UpdateUserDTO, @Param('userid') userid: string) {
    const existedUser = await this.userService.findById(userid);
    if (!existedUser) {
      throw new NotFoundException('user not found');
    }
    const updatedUser = await this.userService.updateUser(userid, updateUserDTO);
    return tranformUserModelToDTO(updatedUser);
  }

  @Post('/:userid/reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(@Body() body: ResetPasswordDTO, @Param('userid') userid: string) {
    const existedUser = await this.userService.findById(userid);
    if (!existedUser) {
      throw new NotFoundException('user not found');
    }
    await this.userService.resetPasswordUser(userid, body.password);
    return {};
  }
}
