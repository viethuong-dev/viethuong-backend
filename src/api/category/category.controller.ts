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
import { CategoryService } from 'src/biz/category/category.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationKeySeachQuery } from 'src/util/pagination';
import { Category as CategoryModel } from 'src/biz/category/Category';
import { Public } from 'src/guards/base.guard';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @ApiOkResponse({ type: CategoryModel })
    @Post('/')
    @Roles(Role.ADMIN, Role.CONTENT_STAFF)
    async createCategory(@Body() category: CategoryModel) {
        return this.categoryService.create(category);
    }

    @ApiOkResponse({
        type: CategoryModel,
        isArray: true,
    })
    @Public()
    @Get('/')
    async getCategorys(@Query() pagQuery: PaginationKeySeachQuery) {
        pagQuery.offset = pagQuery.offset || 0;
        pagQuery.limit = pagQuery.limit || 20;
        const [categorys, total] = await this.categoryService.getAndCount(
            pagQuery,
        );
        return { categorys, total };
    }

    @ApiOkResponse({
        type: CategoryModel,
        isArray: false,
    })
    @Public()
    @Get('/:id')
    async getCategory(@Param('id') categoryId: string) {
        const category = await this.categoryService.findById(categoryId);
        if (!category) {
            throw new NotFoundException('category not found');
        }
        return category;
    }

    @ApiOkResponse({
        type: CategoryModel,
        isArray: false,
    })
    @Put('/:id')
    @Roles(Role.ADMIN, Role.CONTENT_STAFF)
    async updateCategory(
        @Param('id') categoryId: string,
        @Body() category: CategoryModel,
    ) {
        const existedCategory = await this.categoryService.findById(categoryId);
        if (!existedCategory) {
            throw new NotFoundException('category not found');
        }
        return this.categoryService.update(categoryId, category);
    }

    @Delete('/:id')
    @Roles(Role.ADMIN, Role.CONTENT_STAFF)
    async deleteCategory(@Param('id') categoryId: string) {
        const existedCategory = await this.categoryService.findById(categoryId);
        if (!existedCategory) {
            throw new NotFoundException('category not found');
        }
        return this.categoryService.delete(categoryId);
    }
}
