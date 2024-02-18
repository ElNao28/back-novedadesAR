import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { LoginModule } from './login/login.module';
import { RecoverPasswordModule } from './recover-password/recover-password.module';
import { CheckEmailModule } from './check-email/check-email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'roundhouse.proxy.rlwy.net',//roundhouse.proxy.rlwy.net
      port: 23516,//23516
      username: 'root',
      password: '3CfeBhE43BA4CghG1G5HgDhh62D5GHdF',//3CfeBhE43BA4CghG1G5HgDhh62D5GHdF
      database: 'railway',//railway
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    UsersModule,
    EmailModule,
    LoginModule,
    RecoverPasswordModule,
    CheckEmailModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
