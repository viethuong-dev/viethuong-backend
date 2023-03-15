import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class PostTranslationContent {
  @IsNotEmpty()
  @ApiResponseProperty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiResponseProperty()
  @ApiProperty()
  content: string;
}

export class PostTranslation {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PostTranslationContent)
  @ApiResponseProperty()
  @ApiProperty()
  en: PostTranslationContent;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PostTranslationContent)
  @ApiResponseProperty()
  @ApiProperty()
  vi: PostTranslationContent;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Post {
  @ApiResponseProperty({ type: String })
  _id?: Types.ObjectId;

  @Prop()
  @ApiResponseProperty({ type: PostTranslation })
  translation: PostTranslation;

  // @Prop()
  // @ApiResponseProperty()
  // status: USER_STATUS;

  @ApiResponseProperty()
  created_at?: Date;

  @ApiResponseProperty()
  updated_at?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
