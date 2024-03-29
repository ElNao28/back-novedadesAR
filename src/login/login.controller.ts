import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { ValidLoginDto } from './dto/valid-login.dto';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService, private userService:UsersService) {}

  intento:number = 0;

  @Post()
  async validLogin(@Body() createLoginDto: ValidLoginDto) {
    

    try 
    {
      const datos = await this.userService.getUser(createLoginDto.email)
      if(datos === null) throw new error("error")

      this.intento = datos.intentos;
      if(this.intento === 8){  
        return {
        message: 'Numero de maxinmo de intentos alcanzado',
        status: HttpStatus.CONFLICT,
        nIntentos: this.intento
      }}
      else
      {
        this.intento++;
        this.loginService.asignarIntentos(datos.id,this.intento)
          if(this.intento >= 8)
          {
            console.log("la de abajo")
            this.loginService.resetearIntentos(datos.id)
            return {
                  message: 'Numero de maxinmo de intentos alcanzado',
                  status: HttpStatus.CONFLICT,
                  nIntentos: this.intento
                }
          }
          else
          {
            const data = this.loginService.validLogin(createLoginDto);
            if((await data) === true)
            {
              this.loginService.resetearIntentos(datos.id)
              return {
                    message: 'Login correcto',
                    status: 200,

                  } 
            }
            else
            return {
                  message: 'Login incorrecto',
                  status: 400
                }
          }
      }
    } catch (error) {
      throw new HttpException("El correo no existe", HttpStatus.FOUND);
    }
  }
}
