import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerConfig } from './swagger/swagger';
import mongoose from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
        cors: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    mongoose.set('debug', true);
    const swaggerConfig = createSwaggerConfig();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3000);
}
bootstrap();
