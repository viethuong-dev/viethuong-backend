import { Module } from '@nestjs/common';
import { BizModule } from 'src/biz/biz.module';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { ConstantController } from './cte/cte.controller';
import { PostController } from './post/post.controller';
import { FileController } from './file/file.controller';
import { ProductController } from './product/product.controller';
import { CategoryController } from './category/category.controller';

@Module({
    imports: [BizModule],
    controllers: [
        UserController,
        AuthController,
        ConstantController,
        PostController,
        FileController,
        ProductController,
        CategoryController,
    ],
})
export class ApiModule {}
