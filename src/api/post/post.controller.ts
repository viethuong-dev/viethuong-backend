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
} from '@nestjs/common';
import { Role } from 'src/constants/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { PostService } from 'src/biz/post/post.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationKeySeachQuery } from 'src/util/pagination';
import { Post as PostModel } from 'src/biz/post/Post';
import { Public } from 'src/guards/base.guard';

@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @ApiOkResponse({ type: PostModel })
    @Post('/')
    @Roles(Role.ADMIN, Role.CONTENT_STAFF)
    async createPost(@Body() post: PostModel) {
        return this.postService.create(post);
    }

    @ApiOkResponse({
        type: PostModel,
        isArray: true,
    })
    @Public()
    @Get('/')
    async getPosts(@Query() pagQuery: PaginationKeySeachQuery) {
        pagQuery.offset = pagQuery.offset || 0;
        pagQuery.limit = pagQuery.limit || 20;
        const [posts, total] = await this.postService.getAndCount(pagQuery);
        return { posts, total };
    }

    @ApiOkResponse({
        type: PostModel,
        isArray: false,
    })
    @Public()
    @Get('/:id')
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
    async updatePost(@Param('id') postId: string, @Body() post: PostModel) {
        const existedPost = await this.postService.findById(postId);
        if (!existedPost) {
            throw new NotFoundException('post not found');
        }
        return this.postService.update(postId, post);
    }

    @Delete('/:id')
    @Roles(Role.ADMIN, Role.CONTENT_STAFF)
    async deletePost(@Param('id') postId: string) {
        const existedPost = await this.postService.findById(postId);
        if (!existedPost) {
            throw new NotFoundException('post not found');
        }
        return this.postService.delete(postId);
    }
}
