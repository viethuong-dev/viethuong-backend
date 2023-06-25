import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/biz/auth/Payload';
import { Token } from 'src/biz/auth/Token';
import { AuthService } from 'src/biz/auth/auth.service';
import { UserService } from 'src/biz/user/user.service';
import { AuthUser } from 'src/decorators/authuser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { LoginDTO, RefreshTokenDTO } from './auth.dto';
import { tranformUserModelToDTO } from '../user/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) {}

    @Post('/login')
    @ApiOkResponse({
        type: Token,
        isArray: false,
    })
    async login(@Body() body: LoginDTO) {
        const username = body.username;
        const password = body.password;
        const user = await this.userService.validatePassword(
            username,
            password,
        );
        if (user instanceof Error) {
            throw new UnauthorizedException(user.message);
        }
        const token = await this.authService.generateToken(user);
        await this.authService.createUserRefreshToken(
            token.refresh_token,
            user._id,
        );
        return { ...token, user: tranformUserModelToDTO(user) };
    }

    @ApiOkResponse({
        type: Token,
        isArray: false,
    })
    @Post('/refresh-token')
    async refreshToken(@Body() body: RefreshTokenDTO) {
        const refreshToken = body.refresh_token;
        const payload = this.authService.verifyRefreshToken(refreshToken);
        const savedUserRefreshToken =
            await this.authService.getUserRefreshToken(refreshToken);
        if (!savedUserRefreshToken) {
            throw new ForbiddenException('refresh_token not found');
        }
        const token = await this.authService.refreshToken(
            payload,
            refreshToken,
        );
        return token;
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    async logout(@AuthUser() authUser: Payload, @Body() body: RefreshTokenDTO) {
        const refreshToken = body.refresh_token;
        const savedUserRefreshToken =
            await this.authService.getUserRefreshToken(refreshToken);
        if (
            !savedUserRefreshToken ||
            savedUserRefreshToken.user_id.toHexString() !== authUser.userid
        ) {
            throw new ForbiddenException('refresh_token not found');
        }
        await this.authService.deleteRefreshToken(refreshToken);
        return {};
    }
}
