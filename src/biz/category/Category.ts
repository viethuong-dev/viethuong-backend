import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { BaseModel } from '../base.model';

export class CategoryTranslationContent {
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @ApiProperty()
    description: string;
}

export class CategoryTranslation {
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => CategoryTranslationContent)
    @ApiProperty({ type: CategoryTranslationContent })
    en: CategoryTranslationContent;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => CategoryTranslationContent)
    @ApiProperty({ type: CategoryTranslationContent })
    vi: CategoryTranslationContent;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Category extends BaseModel {
    @Prop()
    @ApiProperty({ type: CategoryTranslation })
    translation: CategoryTranslation;

    // @ApiResponseProperty({ type: [Product] })
    // products: Product[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
