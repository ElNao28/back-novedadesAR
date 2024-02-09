import { Module } from '@nestjs/common';
import { RecoverPasswordService } from './recover-password.service';
import { RecoverPasswordController } from './recover-password.controller';

@Module({
  controllers: [RecoverPasswordController],
  providers: [RecoverPasswordService],
})
export class RecoverPasswordModule {}
