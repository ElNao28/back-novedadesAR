import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { ValidLoginDto } from './dto/valid-login.dto';
import { UsersService } from 'src/users/users.service';
import { error } from 'console';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService, private userService: UsersService,

  ) { }

  intento: number = 0;

  @Post()
  async validLogin(@Body() createLoginDto: ValidLoginDto) {

    try {
      const datos = await this.userService.getUser(createLoginDto.email)
      if (datos === null) throw new error("error")

      this.intento = await this.userService.getIntentos(datos.id);
      if (this.intento === 8) {
        return {
          message: 'Numero de maxinmo de intentos alcanzado',
          status: HttpStatus.CONFLICT,
          nIntentos: this.intento
        }
      }
      else {
        this.intento++;
        this.loginService.asignarIntentos(datos.id, this.intento)
        if (this.intento >= 8) {
          console.log("la de abajo");
          this.loginService.resetearIntentos(datos.id);
          this.loginService.createlogs({
            idUser: datos.id,
            accion: "Bloqueo de sesion",
            ip: createLoginDto.ip,
            fecha: createLoginDto.fecha,
            url: "/login",
            status: 409
          });
          return {
            message: 'Numero de maxinmo de intentos alcanzado',
            status: HttpStatus.CONFLICT,
            nIntentos: this.intento
          }
        }
        else {
          const data = this.loginService.validLogin(createLoginDto);
          if ((await data).valid === true) {
            this.loginService.resetearIntentos(datos.id);
            this.loginService.createlogs({
              idUser: datos.id,
              accion: "Inicio de sesion exitoso",
              ip: createLoginDto.ip,
              fecha:createLoginDto.fecha,
              url: "/login",
              status: 200
            });
            return {
              message: 'Login correcto',
              status: 200,
              token: (await data).token
            }
          }
          else {
            this.loginService.createlogs({
              idUser: datos.id,
              accion: "Fallo de inicio de sesion",
              ip: createLoginDto.ip,
              fecha:createLoginDto.fecha,
              url: "/login",
              status: 400
            });
            return {
              message: 'Login incorrecto',
              status: 400
            }
          }
        }
      }
    } catch (error) {
      return {
        message: 'Correo incorrecto',
        status: 400
      }
    }
  }

  @Get('login-alexa/:code')
  loginAlexa(@Param('code')code:string){
    console.log(code)
    return this.loginService.loginAlexa(code)
  }
}
