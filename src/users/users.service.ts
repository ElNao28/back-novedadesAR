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
    const foundUser = await this.userRepository.findOne({
      where: {
        email: userData.email
      }
    });
  
    if (!foundUser) {

      const{password,answer, ...userDt} = userData;
      answer.toLowerCase();
      const newUser = this.userRepository.create({
        password: bcryptjs.hashSync(password,10),
        answer: bcryptjs.hashSync(answer.toLowerCase(),10),
        ...userDt
      });
      return this.userRepository.save(newUser);
    }
  
    throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
  }
  

  getUsers() {
    const users = this.userRepository.find();
    return users;
  }

  getUser(email: string) {
    const user = this.userRepository.findOne({
      where: {
        email: email
      }
    });
      return user;
  }

  updateUser(id: number, updateData: UpdateUserDto) {
    const {password, ...data} = updateData;
    const userUpdate = this.userRepository.update(id, {
      password: password? bcryptjs.hashSync(password, 10) : null,
      ...data
    })
    return userUpdate;
  }

  DeleteUser(id: number) {
    const deleteUser = this.userRepository.delete({id:id})
    return deleteUser;
  }
}
