import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown fields
      forbidNonWhitelisted: true, // Throw error if unknown field
      transform: true, // Auto-transform payloads to DTO classes
    }),
  );
  console.log("Running main.ts");
  console.log(process.env.MONGO_URI);
  console.log(process.env.JWT_SECRET);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
