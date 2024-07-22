import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { LoginModule } from './login/login.module';
import { RecoverPasswordModule } from './recover-password/recover-password.module';
import { CheckEmailModule } from './check-email/check-email.module';
import { ProductsModule } from './products/products.module';
import { CarritoModule } from './carrito/carrito.module';
import { VentasModule } from './ventas/ventas.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'monorail.proxy.rlwy.net',//localhost monorail.proxy.rlwy.net
      port: 32140,//3306 32140
      username: 'root',
      password: 'SOZqfoANqhNxIbtccwkusRwjpdvxfsKf',//SOZqfoANqhNxIbtccwkusRwjpdvxfsKf
      database: 'railway',//railway db_novedadesar
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    EmailModule,
    LoginModule,
    RecoverPasswordModule,
    CheckEmailModule,
    ProductsModule,
    CarritoModule,
    VentasModule,
    AdminModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
