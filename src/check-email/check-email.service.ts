import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCheckEmailDto } from './dto/create-check-email.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CheckEmailService {
  constructor(private userService:UsersService){}

  async checkData(data: CreateCheckEmailDto) {
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
}
