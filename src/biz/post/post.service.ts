import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './Post';
import { Model, SortOrder } from 'mongoose';
import { PaginationKeySeachQuery } from 'src/util/pagination';
import { build_search_object_in_translation } from 'src/util/helper';

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

    async createPost(post: Post) {
        return this.postModel.create(post);
    }

    async getAndCountPost(reqQuery: PaginationKeySeachQuery) {
        let options = {};
        if (reqQuery.search) {
            options = build_search_object_in_translation(reqQuery.search, [
                'title',
                'content',
            ]);
        }
        const dbQuery = this.postModel.find(options);
        if (reqQuery.sort) {
            const sortOrder: SortOrder = reqQuery.order === 'asc' ? 1 : -1;
            dbQuery.sort({ [reqQuery.sort]: sortOrder });
        }
        dbQuery.skip(reqQuery.offset).limit(reqQuery.limit);
        const result = await Promise.all([
            dbQuery,
            this.postModel.count(options),
        ]);
        return result;
    }

    async findById(id: string): Promise<Post | null> {
        try {
            const post = await this.postModel.findById(id);
            return post;
        } catch (error) {
            return null;
        }
    }

    async updatePost(id: string, post: Post): Promise<Post> {
        return this.postModel.findByIdAndUpdate(id, post, { new: true });
    }

    async deletePost(id: string): Promise<Post> {
        return this.postModel.findByIdAndDelete(id);
    }
}
