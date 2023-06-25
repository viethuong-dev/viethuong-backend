import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
    const swaggerConfig = new DocumentBuilder()
        .setTitle('Viethuong Ecommerce App')
        .setDescription('Viethuong Ecommerce App API docs')
        .setVersion('1.0')
        .addBearerAuth(
            { type: 'apiKey', in: 'header', name: 'authorization' },
            'Bearer',
        )
        // .addApiKey({ type: 'apiKey', in: 'header', name: 'authorization' }, 'Bearer')
        .addSecurityRequirements('Bearer');
    return swaggerConfig.build();
}
