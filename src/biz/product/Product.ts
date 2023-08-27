import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { BaseModel } from '../base.model';

export class ProductTranslationContent {
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsNotEmpty()
    @ApiProperty()
    description: string;
}

export class ProductTranslation {
    @ValidateNested()
    @IsNotEmpty()
    @Type(() => ProductTranslationContent)
    @ApiProperty({ type: ProductTranslationContent })
    en: ProductTranslationContent;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => ProductTranslationContent)
    @ApiProperty({ type: ProductTranslationContent })
    vi: ProductTranslationContent;
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Product extends BaseModel {
    @ApiResponseProperty({ type: String })
    @ApiProperty()
    @Prop()
    category_id: Types.ObjectId;

    @ApiProperty({ type: ProductTranslation })
    @Prop()
    translation: ProductTranslation;

    @ApiProperty()
    @Prop()
    price: string;

    @ApiProperty()
    @Prop()
    image_urls: string[];

    // @ApiResponseProperty({ type: Category })
    // category: Category;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
