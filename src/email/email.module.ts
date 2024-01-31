import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from './email.service';

@Module({
  imports: [UsersModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
  