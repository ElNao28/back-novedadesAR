import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepository:Repository<User>){}  

  async createUser(userData: CreateUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: {
        username: userData.username
      }
    });
  
    if (!foundUser) {
      const newUser = this.userRepository.create(userData);
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
    const userUpdate = this.userRepository.update(id, updateData)
    return userUpdate;
  }

  DeleteUser(id: number) {
    const deleteUser = this.userRepository.delete({id:id})
    return deleteUser;
  }
}
