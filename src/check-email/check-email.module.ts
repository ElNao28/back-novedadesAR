import { Module } from '@nestjs/common';
import { CheckEmailService } from './check-email.service';
import { CheckEmailController } from './check-email.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CheckEmailController],
  providers: [CheckEmailService],
  imports:[UsersModule]
})
export class CheckEmailModule {}
