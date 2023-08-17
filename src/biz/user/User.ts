import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Role } from 'src/constants/role.enum';
import { USER_STATUS } from 'src/constants/userstatus.enum';

@Schema({ timestamps: true })
export class User {
    _id?: Types.ObjectId;

    @Prop()
    username: string;

    @Prop()
    fullname: string;

    @Prop()
    hashed_password: string;

    @Prop()
    salt: string;

    @Prop()
    roles: Role[];

    @Prop()
    status: USER_STATUS;

    createdAt?: Date;

    updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
