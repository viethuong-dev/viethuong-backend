import { ApiResponseProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class BaseModel {
    @ApiResponseProperty({ type: String })
    _id?: Types.ObjectId;

    @ApiResponseProperty()
    created_at?: Date;

    @ApiResponseProperty()
    updated_at?: Date;
}
