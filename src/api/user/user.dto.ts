import { User } from 'src/biz/user/User';
import { Role } from 'src/constants/role.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { USER_STATUS } from 'src/constants/userstatus.enum';

export class CreateUserDTO {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  password: string;
  @IsEnum(Role, { each: true })
  @IsNotEmpty()
  roles: Role[];
}

export class UpdateUserDTO {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  fullname: string;
  @IsEnum(Role, { each: true })
  @IsNotEmpty()
  roles: Role[];
}

export class UserDTO {
  user_id: string;
  username: string;
  fullname: string;
  created_at?: Date;
  roles: Role[];
  status: USER_STATUS;
}

export class UserActionDTO {
  @IsNotEmpty()
  status: USER_STATUS;
}

export class ResetPasswordDTO {
  @IsNotEmpty()
  password: string;
}

export function tranformUserModelToDTO(userModel: User): UserDTO {
  const userDTO: UserDTO = {
    user_id: userModel._id.toHexString(),
    username: userModel.username,
    fullname: userModel.fullname,
    created_at: userModel.createdAt,
    roles: userModel.roles,
    status: userModel.status,
  };
  return userDTO;
}
