import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './Product';
import { Model } from 'mongoose';
import { BaseService } from '../base.service';

@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
    ) {
        super(productModel);
        this.searchKeys = ['title', 'description'];
    }
}
