import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/User';
import { AuthService } from './auth/auth.service';
import {
    UserRefreshToken,
    UserRefreshTokenSchema,
} from './auth/UserRefreshToken';
import { JwtService } from '@nestjs/jwt';
import { PostService } from './post/post.service';
import { Post, PostSchema } from './post/Post';
import { CloudinaryService } from './file/cloudinary.service';
import { CloudinaryProvider } from './file/cloudinary.provider';
import { Product, ProductSchema } from './product/Product';
import { ProductService } from './product/product.service';
import { Category, CategorySchema } from './category/Category';
import { CategoryService } from './category/category.service';

const dbModules = [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
        { name: UserRefreshToken.name, schema: UserRefreshTokenSchema },
    ]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
        { name: Category.name, schema: CategorySchema },
    ]),
];
const services = [
    UserService,
    AuthService,
    JwtService,
    PostService,
    CloudinaryService,
    CloudinaryProvider,
    ProductService,
    CategoryService,
];

@Module({
    imports: [...dbModules],
    providers: services,
    exports: services,
})
export class BizModule {}
