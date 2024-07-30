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
import { TestMsjModule } from './test-msj/test-msj.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'monorail.proxy.rlwy.net',//monorail.proxy.rlwy.net localhost
      port: 32140,//32140 3306
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
    AdminModule,
    //TestMsjModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}