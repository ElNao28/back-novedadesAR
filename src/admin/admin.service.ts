import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)private adminRepository:Repository<Admin>,
    private jwtService:JwtService,
  ){}
  async loginAdmin(email:string, password:string) {
    console.log(email, password)
    const foundUser = await this.adminRepository.findOne({
      where:{
        email
      }
    });
    if(!foundUser) return{
      message:'Error con los datos',
      status:HttpStatus.UNAUTHORIZED
    }
    if(foundUser.password === password){
      const payload = {sub: foundUser.id, username: foundUser.nombre,rol:'admin' };
      const tocken =  this.jwtService.sign(payload);
      return {
        message:'Login exitoso',
        status:HttpStatus.OK,
        data:{
          id:tocken,
          nombre:foundUser.nombre + " " + foundUser.lastName + " " + foundUser.motherLastname
        }
      }
    }
    else{
      return {
        message:'Error con los datos',
        status:HttpStatus.UNAUTHORIZED
      }
    }
  }
}
