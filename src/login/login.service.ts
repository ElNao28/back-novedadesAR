import { HttpStatus, Injectable } from '@nestjs/common';
import { ValidLoginDto } from './dto/valid-login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Intentos } from 'src/users/entities/intentos.entity';
import { Logs } from 'src/users/entities/logs.entity';

@Injectable()
export class LoginService {

  constructor(
      @InjectRepository(User) private userRepository:Repository<User>,
      @InjectRepository(Intentos) private intentosRepository:Repository<Intentos>,
      @InjectRepository(Logs) private logsRepository: Repository<Logs>,
      private userService:UsersService,
      private jwtService: JwtService
    ){}

    async validLogin(createLoginDto: ValidLoginDto) {

      const data = await this.userService.getUser(createLoginDto.email)
      const payload = { sub: data.id, username: data.name,rol:'user' };
      const tocken =  this.jwtService.sign(payload);
      const res = this.jwtService.decode(tocken);
      console.log(tocken)
      if(await bcryptjs.compare(createLoginDto.password, data.password))
        return{
          valid: true,
          token: tocken
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
  }

  async resetearIntentos(id:number){
    const dataUser = await this.userRepository.findOne({
      where:{
        id:id
      },
      relations:['intentos']
    });
    console.log("conteo iniciado")
    setTimeout(()=>{
      this.intentosRepository.update(dataUser.intentos.id,{
        intentos:0
      })
      console.log("Intentos reseteados")
    },10000)
  }
  async createlogs(data:{idUser:number,accion:string,ip:string,url:string,status:number,fecha:string}){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:data.idUser
      }
    });
    const newLog = this.logsRepository.create({
     accion:data.accion,
     ip:data.ip,
     url_solicitada:data.url,
     status:data.status,
     usuario:foundUser,
     fecha:data.fecha
    });
    this.logsRepository.save(newLog);
  }
  async loginAlexa(codeAlexa:string){
    const foundUser = await this.userRepository.findOne({
      where:{
        codeAlexa
      }
    });
    if(!foundUser)return{
      message:'no encontrado',
      status:HttpStatus.NOT_FOUND
    }
    return{
      message:'Exito',
      status:HttpStatus.OK,
      data:{
        id:foundUser.id,
        nombre:foundUser.name + " " + foundUser.lastname + " " + foundUser.motherLastname
      }
    }
  }
} 