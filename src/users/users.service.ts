import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs'
import { Intentos } from './entities/intentos.entity';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { Ubicacion } from './entities/ubicacion.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Intentos) private intentosRepository: Repository<Intentos>,
    @InjectRepository(Ubicacion) private ubicacionRepository: Repository<Ubicacion>,
  ) { }

  async createUser(userData: CreateUserDto) {

    let dataUbi:CreateUbicacionDto = {
      estado: userData.estado,
      municipio: userData.municipio,
      cp:userData.cp,
      colonia:userData.colonia
    }

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
    if (foundEmail) return {
      message: 'El usuario ya existe',
      status: HttpStatus.CONFLICT,
    }
    if (foundCellphone) return {
      message: 'El usuario ya existe',
      status: HttpStatus.CONFLICT,
    }

    const { password, ...userDt } = userData;

    const newUser = this.userRepository.create({
      password: bcryptjs.hashSync(password, 10),
      ...userDt
    });
    this.userRepository.save(newUser);

    setTimeout(() => {
      this.createTableIntentos(userDt.email)
      this.createUbicacionTable(dataUbi,userDt.email)
    }, 1000);
    return {
      message: 'Usuario creado correctamente',
      status: HttpStatus.ACCEPTED,
    };
  }
  async createTableIntentos(emailUser:string) {
    const userFound = await this.userRepository.findOne({
      where: {
        email: emailUser
      }
    });
    if(!userFound) new HttpException('error',HttpStatus.BAD_REQUEST);

    const newIntentos = this.intentosRepository.create({
      intentos: 0
    });
    const saveIntento = await this.intentosRepository.save(newIntentos);
    userFound.intentos = saveIntento;

    this.userRepository.save(userFound);
  }

  async createUbicacionTable(data:CreateUbicacionDto, emailUser:string) {
    const userFound = await this.userRepository.findOne({
      where: {
        email: emailUser
      }
    });
    if(!userFound) new HttpException('error',HttpStatus.BAD_REQUEST);

    const newUbicacion = this.ubicacionRepository.create(data);
    const saveUbicacion = await this.ubicacionRepository.save(newUbicacion)

    userFound.ubicacion = saveUbicacion

    this.userRepository.save(userFound);
  }

  getUsers() {
    const users = this.userRepository.find({
    });
    return users;
  }

  getUser(email: string) {
    const user = this.userRepository.findOne({
      where: {
        email: email
      },
      relations: [
        'carrito', 'carrito.detallesCarrito', 'carrito.detallesCarrito.product', 'logs', 'ventas', 'intentos', 'question', 'ubicacion', 'rol', 'ventas.detallesVenta', 'ventas.detallesVenta.producto']
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
    const dataUser = await this.getUser(email)
    const { password, ...data } = updateData;
    if(updateData.password){
      this.userRepository.update( dataUser.id, {
        password: bcryptjs.hashSync(password, 10) ,
        ...data
      })
    }
    else{
      this.userRepository.update((await dataUser).id,updateData)
    }
    
    return {
      message: 'Usuario creado correctamente',
      status: HttpStatus.ACCEPTED,
    };
  }

  async updateUbicacion(email:string, dataUbic:CreateUbicacionDto){
    const foundUser = await this.userRepository.findOne({
      where:{
        email:email
      },
      relations:['ubicacion']
    });

    if(!foundUser) return new HttpException("error", HttpStatus.FOUND);
    this.ubicacionRepository.update(foundUser.ubicacion.id,dataUbic)
  }

  DeleteUser(id: number) {
    const deleteUser = this.userRepository.delete({ id: id })
    return deleteUser;
  }
}
