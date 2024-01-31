import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ValidLoginDto } from './dto/valid-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
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

  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
