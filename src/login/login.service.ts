import { Injectable } from '@nestjs/common';
import { ValidLoginDto } from './dto/valid-login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Intentos } from 'src/users/entities/intentos.entity';

@Injectable()
export class LoginService {

  constructor(
      @InjectRepository(User) private userRepository:Repository<User>,
      @InjectRepository(Intentos) private intentosRepository:Repository<Intentos>,
      private userService:UsersService,
      private jwtService: JwtService
    ){}

    async validLogin(createLoginDto: ValidLoginDto) {

      const data = this.userService.getUser(createLoginDto.email)
      const payload = { sub: (await data).id, username: (await data).name };
      const tocken =  this.jwtService.sign(payload)
      const res = this.jwtService.decode(tocken)
      console.log(res);

      if(await bcryptjs.compare(createLoginDto.password, (await data).password))
        return{
          valid: true,
          token: (await data).id
        }
      else
        return {
          valid: false,
          token: ''
        }
  }

  async asignarIntentos(id:number, intento:number){
    const dataUser = await this.userRepository.findOne({
      where:{
        id:id
      },
      relations:['intentos']
    });
    this.intentosRepository.update(dataUser.intentos.id,{
      intentos: intento
    })
    // this.userRepository.query(
    //   "UPDATE users SET intentos = "+intento+" WHERE id = "+id+""
    // )
  }

  resetearIntentos(id:number){
    console.log("conteo iniciado")
    setTimeout(()=>{
      this.userRepository.query(
        "UPDATE users SET intentos = 0 WHERE id = "+id+""
      )
      console.log("Intentos reseteados")
    },10000)
  }
}