import {
    BadRequestException,
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
import { ProductService } from 'src/biz/product/product.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationKeySeachQuery } from 'src/util/pagination';
import { Product as ProductModel } from 'src/biz/product/Product';
import { Public } from 'src/guards/base.guard';
import { CategoryService } from 'src/biz/category/category.service';
import { STATUS } from 'src/constants/status.enum';

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
    ) {}

    async validateCategory(product: ProductModel) {
        if (product.category_id) {
            const category = await this.categoryService.findById(
                product.category_id,
            );
            if (!category) {
                throw new BadRequestException('category not found');
            }
        }
    }

    @ApiOkResponse({
        type: ProductModel,
        isArray: false,
    })
    @Post('/')
    @Roles(Role.ADMIN, Role.CONTENT_STAFF)
    async createProduct(@Body() product: ProductModel) {
        await this.validateCategory(product);
        return this.productService.create(product);
    }

    @ApiOkResponse({
        type: ProductModel,
        isArray: true,
    })
    @Public()
    @Get('/')
    async getProducts(
        @Query() pagQuery: PaginationKeySeachQuery,
        @Query('category_id') categoryId: string,
        @Query('status') status: STATUS = STATUS.ACTIVATED,
    ) {
        pagQuery.offset = pagQuery.offset || 0;
        pagQuery.limit = pagQuery.limit || 20;
        const [products, total] = await this.productService.getAndCount(
            pagQuery,
            { category_id: categoryId, status: status },
        );
        return { products, total };
    }

    @ApiOkResponse({
        type: ProductModel,
        isArray: false,
    })
    @Public()
    @Get('/:id')
    async getProduct(@Param('id') productId: string) {
        const product = await this.productService.findById(productId);
        if (!product) {
            throw new NotFoundException('product not found');
        }
        return product;
    }

    @ApiOkResponse({
        type: ProductModel,
        isArray: false,
    })
    @Put('/:id')
    @Roles(Role.ADMIN, Role.CONTENT_STAFF)
    async updateProduct(
        @Param('id') productId: string,
        @Body() product: ProductModel,
    ) {
        const existedProduct = await this.productService.findById(productId);
        if (!existedProduct) {
            throw new NotFoundException('product not found');
        }
        await this.validateCategory(product);
        return this.productService.update(productId, product);
    }

    @Delete('/:id')
    @Roles(Role.ADMIN, Role.CONTENT_STAFF)
    async deleteProduct(@Param('id') productId: string) {
        const existedProduct = await this.productService.findById(productId);
        if (!existedProduct) {
            throw new NotFoundException('product not found');
        }
        return this.productService.delete(productId);
    }
}
