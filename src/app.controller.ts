import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './guards/base.guard';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Public()
    @Get()
    ping(): object {
        return {};
    }
}
