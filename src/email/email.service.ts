import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { SendEmailDto } from './dto/send-email.dto';

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

    async sendMail(userData:SendEmailDto, code:string): Promise<void> { 
         const mailOptions: nodemailer.SendMailOptions = {
           from: '"Pruebas"',
           to: userData.to,
           subject: 'Prueba',
           text: "Tu codigo para restablecer tu contraseña es "+code,
         };

         const info = await this.transporter.sendMail(mailOptions);
         console.log('Message sent: %s', info.messageId); 
    }

    generateCode():string{
        const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let codigo = '';

        for (let i = 0; i < 10; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          codigo += caracteres.charAt(indiceAleatorio);
        }

        return codigo;
    }
}

