import { JwtAuthGuard } from '@account/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '@infrastructure/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AppModule } from './app.module';
// import * as firebase_credential from './tutor-32d69-firebase-adminsdk-p8025-f8ea7c7cd9.json';
// import { ServiceAccount } from 'firebase-admin';
// import * as admin from 'firebase-admin';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'body-parser';
import { text } from 'express';
// import { json, urlencoded } from 'body-parser';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(text());
  process.env.TZ = 'Africa/Addis_Ababa'; // UTC +03:00
  app.setGlobalPrefix('api');
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: false,
      docExpansion: 'none',
    },
    customSiteTitle: 'Joshua API Documentation',
  };
  const config = new DocumentBuilder()
    .setTitle('Joshua API')
    .setDescription('Joshua API Documentation')
    .setVersion('1.0')
    // .setContact(
    //   'Vintage Technology PLC',
    //   'http://vintechplc.com/',
    //   'marketing@vintechplc.com',
    // )
    .addBearerAuth(
      {
        type: 'http',
        schema: 'Bearer',
        bearerFormat: 'Token',
      } as SecuritySchemeObject,
      'Bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  // // Set the config options
  // const adminConfig: ServiceAccount = {
  //   projectId: firebase_credential.project_id,
  //   privateKey: firebase_credential.private_key,
  //   clientEmail: firebase_credential.client_email,
  // };
  // admin.initializeApp({
  //   credential: admin.credential.cert(adminConfig),
  //   // databaseURL: 'https://mobile-transport-8dcd6-default-rtdb.firebaseio.com',
  // });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // pipes
  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  SwaggerModule.setup('/', app, document, customOptions);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  const PORT = process.env.PORT || 3000;
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(PORT);
  const date = new Date();
  console.log(`Current Date=> ${date} ${process.env.NODE_ENV}`);
}
bootstrap();
