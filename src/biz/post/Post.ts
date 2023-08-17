import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseModel } from '../base.model';

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
export class Post extends BaseModel {
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => PostTranslation)
    @ApiResponseProperty({ type: PostTranslation })
    @ApiProperty()
    @Prop()
    translation: PostTranslation;

    // @Prop()
    // @ApiResponseProperty()
    // status: USER_STATUS;
}

export const PostSchema = SchemaFactory.createForClass(Post);
