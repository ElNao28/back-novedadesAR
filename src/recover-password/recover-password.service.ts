import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRecoverPasswordDto } from './dto/create-recover-password.dto';
import { UsersService } from 'src/users/users.service';
import { CheckAnswer } from './interface/checkAnswer.interface';

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
   response: datoUser.question.question,
   status:HttpStatus.OK
  }
  }

  async checkAnswer(data:CheckAnswer){
    let dataUser = await (this.userService.getUser(data.email));
    console.log(dataUser)

    if(data.anwer !== dataUser.answer) return{
      response:"respuesta incorrecta",
      status:HttpStatus.CONFLICT
    }
    return{
      response:"Respuesta correcta",
      status:HttpStatus.OK
    }
  }

}