import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'clavesupersecretaUwU',
      signOptions: { expiresIn: '60s' },
    })
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
