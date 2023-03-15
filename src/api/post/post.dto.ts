import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { PostTranslation, PostTranslationContent } from 'src/biz/post/Post';

// export class PostTranslationDTO {
//   @ValidateNested()
//   @IsNotEmpty()
//   @Type(() => PostTranslationContent)
//   en: PostTranslationContent;

//   @ValidateNested()
//   @IsNotEmpty()
//   @Type(() => PostTranslationContent)
//   vi: PostTranslationContent;
// }

export class createPostDTO {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => PostTranslation)
  translation: PostTranslation;
}
