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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'monorail.proxy.rlwy.net',//roundhouse.proxy.rlwy.net localhost
      port: 32140,//23516 3306
      username: 'root',
      password: 'SOZqfoANqhNxIbtccwkusRwjpdvxfsKf',//3CfeBhE43BA4CghG1G5HgDhh62D5GHdF
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
    VentasModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
