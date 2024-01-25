import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { UsersService } from 'src/users/users.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService, private userService:UsersService) {}

  @Post()
  async sendEmail(@Body() dataUser:SendEmailDto) {

    const resp = this.userService.getUser(dataUser.to);

       if((await resp).username === dataUser.username && (await resp).email === dataUser.to){
        const code = this.emailService.generateCode()
        await this.emailService.sendMail(dataUser,code);
        return{
          status:HttpStatus.OK,
          message:"Email enviado correctamente",
          codigo: code,
        }
       } 
       throw new HttpException('El usuario no encontrado', HttpStatus.NOT_FOUND);
  }
}
