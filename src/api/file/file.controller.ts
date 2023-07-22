import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/biz/file/cloudinary.service';

@ApiTags('file')
@Controller('file')
export class FileController {
    constructor(private fileService: CloudinaryService) {}

    @Post('/')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000000 }),
                    new FileTypeValidator({
                        fileType: '^.*.(jpg|JPG|png|PNG)$',
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        try {
            console.log(file);
            const uploadResult = await this.fileService.uploadImage(file);
            // todo: Save meta data to db
            return uploadResult.url;
        } catch (error) {
            // todo: Handle commmon error
            console.log(error);
            throw error;
        }
    }
}
