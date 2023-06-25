import { User } from 'src/biz/user/User';
import { Role } from 'src/constants/role.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { USER_STATUS } from 'src/constants/userstatus.enum';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class CreateUserDTO {
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsEnum(Role, { each: true })
    @IsNotEmpty()
    roles: Role[];
}

export class UpdateUserDTO {
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty()
    @IsEnum(Role, { each: true })
    @IsNotEmpty()
    roles: Role[];
}

export class UserDTO {
    @ApiResponseProperty()
    user_id: string;

    @ApiResponseProperty()
    username: string;

    @ApiResponseProperty()
    fullname: string;

    @ApiResponseProperty()
    created_at?: Date;

    @ApiResponseProperty()
    roles: Role[];

    @ApiResponseProperty()
    status: USER_STATUS;
}

export class UsersDTO {
    users: UserDTO[];

    @ApiResponseProperty()
    total: number;
}

export class UserActionDTO {
    @ApiProperty()
    @IsNotEmpty()
    status: USER_STATUS;
}

export class ResetPasswordDTO {
    @ApiProperty()
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
