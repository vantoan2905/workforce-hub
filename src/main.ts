import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
const port = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Workforce Hub API')
    .setDescription('API documentation for the Workforce Hub')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  console.log('Swagger docs available at {}/api/docs'.replace('{}', `http://localhost:${port}`)); // eslint-disable-line no-console, max-len/api/docs');
  await app.listen(port);
}
bootstrap();
