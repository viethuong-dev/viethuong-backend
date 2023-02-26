import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Viethuong Ecommerce App')
    .setDescription('Viethuong Ecommerce App API docs')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'Authorization' }, 'Authorization')
    .addSecurityRequirements('apikey');
  return swaggerConfig.build();
}
