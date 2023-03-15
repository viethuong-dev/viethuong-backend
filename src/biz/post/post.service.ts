import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './Post';
import { Model, SortOrder } from 'mongoose';
import { createPostDTO } from 'src/api/post/post.dto';
import { PaginationKeySeachQuery } from 'src/util/pagination';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(createPostDTO: createPostDTO) {
    return this.postModel.create(createPostDTO);
  }

  async getAndCountPost(reqQuery: PaginationKeySeachQuery) {
    const options = {
      $or: [
        { title: new RegExp(reqQuery.search, 'i') },
        { content: new RegExp(reqQuery.search, 'i') },
      ],
    };
    const dbQuery = this.postModel.find(options);
    if (reqQuery.sort) {
      const sortOrder: SortOrder = reqQuery.order === 'asc' ? 1 : -1;
      dbQuery.sort({ [reqQuery.sort]: sortOrder });
    }
    dbQuery.skip(reqQuery.offset).limit(reqQuery.limit);
    const result = await Promise.all([dbQuery, this.postModel.count(options)]);
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

  async updatePost(id: string, updateDTO: createPostDTO): Promise<Post> {
    return this.postModel.findByIdAndUpdate(id, updateDTO, { new: true });
  }

  async deletePost(id: string): Promise<Post> {
    return this.postModel.findByIdAndDelete(id);
  }
}
