import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('push-notifications')
export class PushNotificationsController {
  constructor(private readonly pushNotificationsService: PushNotificationsService) {}

  @Post('save')
  public saveToken(@Body()token){
    this.pushNotificationsService.saveTokenToBrowser(token);
  }

  @Post('send')
  public sendNotification(@Body() notification:NotificationDto){
    console.log("si envia")
    return this.pushNotificationsService.sendPushNotification(notification);
  }
}
