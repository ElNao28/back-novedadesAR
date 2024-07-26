import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [UsersModule,TypeOrmModule.forFeature([User])],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
  