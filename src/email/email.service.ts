import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {

  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: 'naopubg28@gmail.com',
        pass: 'stkj apws uvpp ukdw',
      },
    });}

    async sendMail(to: string, subject: string, text: string): Promise<void> {
      const mailOptions: nodemailer.SendMailOptions = {
        from: '"Pruebas"',
        to,
        subject,
        text,
      };
  
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    }
}
