import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserRefreshToken {
  @Prop()
  user_id: Types.ObjectId;
  @Prop()
  refresh_token: string;
  @Prop()
  expired_at: Date;
}

export const UserRefreshTokenSchema = SchemaFactory.createForClass(UserRefreshToken);
