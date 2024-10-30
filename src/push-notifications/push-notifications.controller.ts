import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';

@Controller('push-notifications')
export class PushNotificationsController {
  constructor(private readonly pushNotificationsService: PushNotificationsService) {}

  @Post('save')
  public saveToken(@Body()token){
    console.log(token);
  }

  @Post('send')
  public sendNotification(@Body() notification){
    console.log(notification);
  }
}
