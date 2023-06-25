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

    @ApiProperty({
        default: null,
        required: false,
    })
    sort: string;

    @ApiProperty({
        default: null,
        required: false,
    })
    order: string;
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
    sort: string;

    @ApiProperty({
        default: null,
        required: false,
    })
    order: string;

    @ApiProperty({
        default: null,
        required: false,
    })
    search: string;
}
