import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './Category';
import { BaseService } from '../base.service';

@Injectable()
export class CategoryService extends BaseService<Category> {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
    ) {
        super(categoryModel);
        this.searchKeys = ['title', 'description'];
    }
}
