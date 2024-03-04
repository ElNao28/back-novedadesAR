import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { LoginModule } from './login/login.module';
import { RecoverPasswordModule } from './recover-password/recover-password.module';
import { CheckEmailModule } from './check-email/check-email.module';
import { ComprasModule } from './compras/compras.module';
import { ProductsModule } from './products/products.module';
import { CarritoModule } from './carrito/carrito.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',//roundhouse.proxy.rlwy.net localhost
      port: 3306,//23516 3306
      username: 'root',
      password: '',//3CfeBhE43BA4CghG1G5HgDhh62D5GHdF
      database: 'db_novedadesar',//railway db_novedadesar
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    UsersModule,
    EmailModule,
    LoginModule,
    RecoverPasswordModule,
    CheckEmailModule,
    ComprasModule,
    ProductsModule,
    CarritoModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
