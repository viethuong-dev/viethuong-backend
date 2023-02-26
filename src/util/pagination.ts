import { ApiProperty } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiProperty({
    default: 0,
    required: false,
  })
  offset: number;

  @ApiProperty({
    default: 20,
    required: false,
  })
  limit: number;
}

export class PaginationKeySeachQuery {
  @ApiProperty({
    default: 0,
    required: false,
  })
  offset: number;

  @ApiProperty({
    default: 20,
    required: false,
  })
  limit: number;

  @ApiProperty({
    default: null,
    required: false,
  })
  key_search: string;
}
