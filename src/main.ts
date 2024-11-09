import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    rawBody:true,
  });
  const CorsOptions: CorsOptions = {
    origin: '*' ,//['https://novedades-ar.netlify.app', 'http://localhost:4200','http://localhost:8100','https://novedades-ar-proyecto.vercel.app'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  }
  
  app.useBodyParser('json', { limit: '10mb' });
  app.enableCors(CorsOptions);
  await app.listen( process.env.PORT || 3000 );
}
bootstrap();