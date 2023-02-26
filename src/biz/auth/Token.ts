import { ApiResponseProperty } from '@nestjs/swagger';

export class Token {
  @ApiResponseProperty()
  access_token: string;

  @ApiResponseProperty()
  refresh_token: string;
}
