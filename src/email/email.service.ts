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
        user: 'novedadesar04@gmail.com',
        pass: 'loyd jrrv ifls ifar',
      },
    });}

    async sendMail(userData:SendEmailDto, code:string): Promise<void> { 
      
         const mailOptions: nodemailer.SendMailOptions = {
           from: '"¡Hola!"',
           to: userData.to,
           subject: 'Novedades A&R',
           html: `<!doctype html>
           <html ⚡4email>
       <body>
       <div style="border-radius: 7px; padding-top: 3px; padding-bottom: 3px; background-color: rgb(245, 204, 211); padding-left: 2%; padding-right: 2%;">
            <p style="text-align: center; font-size: large;"<strong style="font-size: medium;">¡Hola!</strong> se solicitó un restablecimiento de contraseña para tu cuenta <span style=" color: rgb(24, 77, 238);">`+userData.to+`</span></p>
            <p style="text-align: center; font-size: large;"> Tu código para restablecer tu contraseña es:</p>
            <h2 style="padding: 10px; text-align: center; background-color: aliceblue; border-radius: 7px;"><strong>`+code+`</strong></h2>
            <p  style="text-align: center; font-size: large;">Puedes hacer caso omiso a este correo si no has solicitado una nueva contraseña. 
                Si tienes cualquier duda o problema contáctanos
                  a través del correo <span style=" color: rgb(24, 77, 238);">novedadesar04@gmail.com</span></p>
                  <p>Atentamente <br>
                   El equipo de Novedades A&R</p>
          </div>
       </body>
           </html>`,
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

    sendEmailCodeEmail(){
      
    }
}

