import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './Post';
import { Model } from 'mongoose';
import { BaseService } from '../base.service';

@Injectable()
export class PostService extends BaseService<Post> {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) {
        super(postModel);
        this.searchKeys = ['title', 'content'];
    }
}
