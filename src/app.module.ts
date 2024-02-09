import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { LoginModule } from './login/login.module';
import { ValidQuestionModule } from './valid-question/valid-question.module';
import { RecoverPasswordModule } from './recover-password/recover-password.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',//roundhouse.proxy.rlwy.net
      port: 3306,//23516
      username: 'root',
      password: '',//3CfeBhE43BA4CghG1G5HgDhh62D5GHdF
      database: 'db_novedadesar',//railway
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    UsersModule,
    EmailModule,
    LoginModule,
    ValidQuestionModule,
    RecoverPasswordModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
