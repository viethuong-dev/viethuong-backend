import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionFilter } from './filter/exception.filter';
import { LoggerModule } from './logger/logger.module';
import { BizModule } from './biz/biz.module';
import { ApiModule } from './api/api.module';
import { RolesGuard } from './guards/roles.guard';
import { AuthGuard } from './guards/auth.guard';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI, {
            dbName: 'viethuong-dev',
            user: 'user1',
            pass: 'my-secret-pw',
            w: 'majority',
            ssl: true,
            retryWrites: true,
            connectionFactory: (connection) => {
                connection.on('connected', () => {
                    console.log('DB connected');
                });
                connection.on('disconnected', () => {
                    console.log('DB disconnected');
                });
                connection.on('error', (error) => {
                    console.log('DB connection failed! for error: ', error);
                });
                return connection;
            },
        }),
        // JwtModule,
        LoggerModule,
        BizModule,
        ApiModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter,
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
