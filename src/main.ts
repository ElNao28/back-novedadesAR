import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD

  // const CorsOptions: CorsOptions = {
  //   origin: ['https://novedades-ar.netlify.app', 'http://localhost:4200'], 
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: false,
  // }
=======
  const CorsOptions: CorsOptions = {
    origin: ['https://novedades-ar.netlify.app', 'http://localhost:4200'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  }
>>>>>>> 6b219c67dc94e6ed3f04eb7c66e3373ad339948c

  // app.enableCors(CorsOptions);

  await app.listen( process.env.PORT || 3000 );
}
bootstrap();