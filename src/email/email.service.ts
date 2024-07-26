import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { SendEmailDto } from './dto/send-email.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EmailService {

  private transporter: nodemailer.Transporter;

  constructor(@InjectRepository(User)private userRepository:Repository<User>) { }


  async sendMail(userData: SendEmailDto, code: string): Promise<void> {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'novedadesar04@gmail.com',
        pass: 'loyd jrrv ifls ifar',
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: '"¡Hola!"',
      to: userData.to,
      subject: 'Novedades A&R',
      html: `<!doctype html>
           <html ⚡4email>
       <body>
       <div style="border-radius: 7px; padding-top: 3px; padding-bottom: 3px; background-color: rgb(245, 204, 211); padding-left: 2%; padding-right: 2%;">
            <p style="text-align: center; font-size: large;"<strong style="font-size: medium;">¡Hola!</strong> se solicitó un restablecimiento de contraseña para tu cuenta <span style=" color: rgb(24, 77, 238);">`+ userData.to + `</span></p>
            <p style="text-align: center; font-size: large;"> Tu código para restablecer tu contraseña es:</p>
            <h2 style="padding: 10px; text-align: center; background-color: aliceblue; border-radius: 7px;"><strong>`+ code + `</strong></h2>
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

  generateCode(): string {
    const caracteres = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let codigo = '';

    for (let i = 0; i < 10; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(indiceAleatorio);
    }

    return codigo;
  }

  sendEmailCodeEmail() {

  }


  async sendMailPromociones(userData: number[]): Promise<void> {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'novedadesar04@gmail.com',
        pass: 'loyd jrrv ifls ifar',
      },
    });
    for (let i = 0; i < userData.length; i++) {

      const userFound = await this.userRepository.findOne({
        where: {
          id: userData[i]
        }
      })
      const mailOptions: nodemailer.SendMailOptions = {
        from: '"¡Hola!"',
        to: userFound.email,
        subject: 'Novedades A&R',
        html: `<!doctype html>
             <html ⚡4email>
         <body>
         <div style="border-radius: 7px; padding-top: 3px; padding-bottom: 3px; background-color: rgb(245, 204, 211); padding-left: 2%; padding-right: 2%;">
              <p style="text-align: center; font-size: large;"<strong style="font-size: medium;">¡Hola!</strong> Estas son unas ofertas para ti <span style=" color: rgb(24, 77, 238);">`+ userFound.email + `</span></p>
              <h2 style="padding: 10px; text-align: center; background-color: aliceblue; border-radius: 7px;"><strong>Ropa para niño </strong></h2>
                    <p>Atentamente <br>
                     El equipo de Novedades A&R</p>
            </div>
         </body>
             </html>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    }

  }




}

