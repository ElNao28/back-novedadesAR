import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenNotificacion } from './entities/token-notifications.entity';
import { NotificationDto } from './dto/notification.dto';

import { Repository } from 'typeorm';
const webpush = require('web-push');


@Injectable()
export class PushNotificationsService {
  private vapidKeys = {
    publicKey:
      'BLZZNJhPTSIAw38z8-uyUGXQLZpNM9qibPj1ZCc4xxxsIU5BSBDxgMkDznCZxaLhCrfGbeYY_QStMhgw6uDZsBk',
    privateKey: 'okjMR8vc3fhC9iM5YlRQX6pmr9lcCKcqqLBKKZnQD1s',
  };
  private options = {
    vapidDetails: {
      subject: 'https://your-domain.com',
      publicKey: this.vapidKeys.publicKey,
      privateKey: this.vapidKeys.privateKey,
    },
  };

  constructor(
    @InjectRepository(TokenNotificacion)
    private tokenNotification: Repository<TokenNotificacion>,
  ) {}

  async saveTokenToBrowser(token: any) {
    const tokenStr = JSON.stringify(token);

    const foundToken = await this.tokenNotification.findOne({
      where: {
        token: tokenStr,
      },
    });
    if (foundToken) return;

    const newToken = this.tokenNotification.create({
      token: tokenStr,
    });
    await this.tokenNotification.save(newToken);
  }

  async sendPushNotification(bodyNotification:NotificationDto) {
    
    const {name, image} = bodyNotification;

    const tokens = await this.tokenNotification.find();
    tokens.forEach((token) => {
      webpush
        .sendNotification(
          JSON.parse(token.token),
          JSON.stringify({
            notification: {
              title: 'Producto con descuento!!!',
              body: name,
              vibrate:[100,50,100],
              image: image
            },
          }),
          this.options,
        )
        .then((resp) => {
          //console.log('Notification sent successfully', resp);
        })
        .catch((err) => {
          //console.error('Error sending notification', err);
        });
    });
  }
}
