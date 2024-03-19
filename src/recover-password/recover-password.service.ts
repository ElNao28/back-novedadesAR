import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRecoverPasswordDto } from './dto/create-recover-password.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RecoverPasswordService {
  constructor(private userService:UsersService){}

  async checkData(data: CreateRecoverPasswordDto) {
    let datoUser = await(this.userService.getUser(data.email))
    
    if(!datoUser) return {
      mensaje:"No existe el usuario",
      status:HttpStatus.NOT_FOUND
    }
    return {
      mensaje:"Usuario encontrado",
      status:HttpStatus.ACCEPTED,
    }
  }

  async checkQuestion(email:string){
   let datoUser = await(this.userService.getUser(email))
   if(!datoUser) return {
      response:"No existe el usuario",
      status:HttpStatus.NOT_FOUND
   }
   return {
    response: datoUser.question,
    status:HttpStatus.OK
   }
  }
}