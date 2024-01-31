import { Injectable } from '@nestjs/common';
import { ValidLoginDto } from './dto/valid-login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class LoginService {

  constructor(private userService:UsersService){}

  async validLogin(createLoginDto: ValidLoginDto):Promise<boolean> {

      const data = this.userService.getUser(createLoginDto.email)
  
      if(await bcryptjs.compare(createLoginDto.password, (await data).password))
        return true;
      else
        return false; 
  }
} 
