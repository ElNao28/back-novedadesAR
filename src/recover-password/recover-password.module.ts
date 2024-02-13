import { Module } from '@nestjs/common';
import { RecoverPasswordService } from './recover-password.service';
import { RecoverPasswordController } from './recover-password.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [RecoverPasswordController],
  providers: [RecoverPasswordService],
  imports:[UsersModule]
})
export class RecoverPasswordModule {}
