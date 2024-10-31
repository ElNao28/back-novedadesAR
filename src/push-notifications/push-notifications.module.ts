import { Module } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { PushNotificationsController } from './push-notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenNotificacion } from './entities/token-notifications.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TokenNotificacion])],
  controllers: [PushNotificationsController],
  providers: [PushNotificationsService],
})
export class PushNotificationsModule {}
