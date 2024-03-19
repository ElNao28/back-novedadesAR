import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs'

@Injectable()
export class UsersService {
 
  constructor(@InjectRepository(User) private userRepository:Repository<User>){}  

  async createUser(userData: CreateUserDto) {
    const foundEmail = await this.userRepository.findOne({
      where: {
        email: userData.email
      }
    });
    const foundCellphone = await this.userRepository.findOne({
      where: {
        cellphone: userData.cellphone
      }
    });
    
    if(foundEmail)return {
      message:'El usuario ya existe',
      status:HttpStatus.CONFLICT,
    }
    if(foundCellphone)return {
      message:'El usuario ya existe',
      status:HttpStatus.CONFLICT,
    }

    const{password, ...userDt} = userData;
    const newUser = this.userRepository.create({
      password: bcryptjs.hashSync(password,10),
      ...userDt
    });
    this.userRepository.save(newUser);
    return {
      message: 'Usuario creado correctamente',
      status:HttpStatus.ACCEPTED,
    };
  }
  

  getUsers() {
    const users = this.userRepository.find({
      relations: ['carrito']
    });
    return users;
  }

  getUser(email: string) {
    const user = this.userRepository.findOne({
      where: {
        email: email
      },
      relations:['carrito']
    });
      return user;
  }

  getUserById(id: number) {
    const user = this.userRepository.findOne({
      where: {
        id: id
      }
    });
      return user;
  }

  async updateUser(email: string, updateData: UpdateUserDto) {
    const dataUser = this.getUser(email);

    const {password, ...data} = updateData;
    this.userRepository.update((await dataUser).id, {
      password: password? bcryptjs.hashSync(password, 10) : null,
      ...data
    })
    return {
      message: 'Usuario creado correctamente',
      status:HttpStatus.ACCEPTED,
    };
  }

  DeleteUser(id: number) {
    const deleteUser = this.userRepository.delete({id:id})
    return deleteUser;
  }
}
