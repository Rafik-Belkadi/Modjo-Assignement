import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Options object for the Swagger documentation
  const options = new DocumentBuilder()
    .setTitle('Modjo Api Assignement')
    .setDescription('The Modjo with pipedrive Assignement')
    .setVersion('1.0')
    .addTag('Modjo')
    .build();

  // Document created with Swagger
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
