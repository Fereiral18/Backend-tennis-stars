import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

const SWAGGER_PATH = 'docs';
const BEARER_AUTH_NAME = 'access-token';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({ origin: configService.get<string | string[]>('app.corsOrigin') });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tennis Stars API')
    .setDescription(
      'REST API for Tennis Stars, an ecommerce for sports shoes (Nike, Adidas, Puma, Under Armour, New Balance, etc). Powers the admin dashboard: categories, products, sales and auth.',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, BEARER_AUTH_NAME)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_PATH, app, swaggerDocument);

  const port = configService.get<number>('app.port') ?? 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Application is running on: http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`📚 Swagger docs available at: http://localhost:${port}/${SWAGGER_PATH}`, 'Bootstrap');
}

void bootstrap();
