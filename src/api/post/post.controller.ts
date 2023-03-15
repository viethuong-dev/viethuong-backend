import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/constants/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { createPostDTO } from './post.dto';
import { PostService } from 'src/biz/post/post.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { PaginationKeySeachQuery, PaginationQuery } from 'src/util/pagination';
import { Post as PostModel } from 'src/biz/post/Post';

@ApiTags('post')
@Controller('post')
@UseGuards(AuthGuard, RolesGuard)
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOkResponse({
    type: PostModel,
    isArray: false,
  })
  @Post('/')
  @Roles(Role.ADMIN, Role.CONTENT_STAFF)
  async createPost(@Body() createPostDto: createPostDTO) {
    const post = await this.postService.createPost(createPostDto);
    return post;
  }

  @ApiOkResponse({
    type: PostModel,
    isArray: true,
  })
  @Get('/')
  @Roles(Role.ADMIN, Role.CONTENT_STAFF)
  async getPosts(@Query() pagQuery: PaginationKeySeachQuery) {
    pagQuery.offset = pagQuery.offset || 0;
    pagQuery.limit = pagQuery.limit || 20;
    const [posts, total] = await this.postService.getAndCountPost(pagQuery);
    return { posts, total };
  }

  @ApiOkResponse({
    type: PostModel,
    isArray: false,
  })
  @Get('/:id')
  @Roles(Role.ADMIN, Role.CONTENT_STAFF)
  async getPost(@Param('id') postId: string) {
    const post = await this.postService.findById(postId);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return post;
  }

  @ApiOkResponse({
    type: PostModel,
    isArray: false,
  })
  @Put('/:id')
  @Roles(Role.ADMIN, Role.CONTENT_STAFF)
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDTO: createPostDTO,
  ) {
    const existedPost = await this.postService.findById(postId);
    if (!existedPost) {
      throw new NotFoundException('post not found');
    }
    return this.postService.updatePost(postId, updatePostDTO);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN, Role.CONTENT_STAFF)
  async deletePost(@Param('id') postId: string) {
    const existedPost = await this.postService.findById(postId);
    if (!existedPost) {
      throw new NotFoundException('post not found');
    }
    return this.postService.deletePost(postId);
  }
}
