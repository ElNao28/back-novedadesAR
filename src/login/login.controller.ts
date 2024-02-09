import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { ValidLoginDto } from './dto/valid-login.dto';
import { UsersService } from 'src/users/users.service';


@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async validLogin(@Body() createLoginDto: ValidLoginDto) {
    try {
      const data = this.loginService.validLogin(createLoginDto);
      if((await data) === true)
      return {
            message: 'Login correcto',
            status: 200,
          }
      else
      return {
            message: 'Login incorrecto',
            status: 400
          }
    } catch (error) {
      throw new HttpException("Email no existe", HttpStatus.CONFLICT);
    }
  }
}
