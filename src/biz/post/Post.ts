import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseModel } from '../base.model';

export class PostTranslationContent {
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @ApiProperty()
    content: string;
}

export class PostTranslation {
    @ValidateNested()
    @Type(() => PostTranslationContent)
    @ApiProperty({ type: PostTranslationContent })
    en: PostTranslationContent;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => PostTranslationContent)
    @ApiProperty({ type: PostTranslationContent })
    vi: PostTranslationContent;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Post extends BaseModel {
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => PostTranslation)
    @ApiProperty()
    @Prop()
    translation: PostTranslation;

    // @Prop()
    // status: USER_STATUS;
}

export const PostSchema = SchemaFactory.createForClass(Post);
