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
import { Rol } from './entities/rol.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { LoginService } from '../login/login.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Intentos) private intentosRepository: Repository<Intentos>,
    @InjectRepository(Ubicacion) private ubicacionRepository: Repository<Ubicacion>,
    @InjectRepository(Rol) private rolRepository:Repository<Rol>,
    @InjectRepository(Carrito) private cardRepository:Repository<Carrito>,
  ) { }

  async createUser(userData: CreateUserDto) {

    let dataUbi:CreateUbicacionDto = {
      estado: userData.estado,
      municipio: userData.municipio,
      cp:userData.cp,
      colonia:userData.colonia,
      referencia:userData.referencia
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
      ...userDt,
    });
    this.userRepository.save(newUser);

    setTimeout(() => {
      this.createTableIntentos(userDt.email);
      this.createUbicacionTable(dataUbi,userDt.email);
      this.addRol(userDt.email);
      this.addCard(userDt.email);
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
  
  async addRol(emailUser:string){
    const foundRol = await this.rolRepository.findOne({
      where:{
        rol:'user'
      }
    });
    const userFound = await this.userRepository.findOne({
      where:{
        email:emailUser
      }
    });
    this.userRepository.update(userFound.id,{
      rol:foundRol
    })
  }
  async addCard(emailUser:string){
    const foundUser = await this.userRepository.findOne({
      where:{
        email:emailUser
      }
    });
    const createCard =  this.cardRepository.create({
      usuario:foundUser
    });
    this.cardRepository.save(createCard)
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
      });
      const foundUser = await this.userRepository.findOne({
        where:{
          email:email
        }
      });
    }
    else{
      this.userRepository.update((await dataUser).id,updateData)
    }
    
    return {
      message: 'Usuario creado correctamente',
      status: HttpStatus.ACCEPTED,
    };
  }

  async updateUbicacion(idUser:number, dataUbic:CreateUbicacionDto){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:idUser
      },
      relations:['ubicacion']
    });

    if(!foundUser) return new HttpException("error", HttpStatus.FOUND);
    this.ubicacionRepository.update(foundUser.ubicacion.id,dataUbic);
    return{
      message:"se actualizo correctamente",
      status:HttpStatus.OK
    }
  }

  async getIntentos(idUser:number){
    const dataUser = await this.userRepository.findOne({
      where:{ 
        id:idUser
      },
      relations:['intentos']
    })
    const intentosUser = await this.intentosRepository.findOne({
      where:{
        id:dataUser.intentos.id,
      }
    })
    return intentosUser.intentos;
  }
  
  DeleteUser(id: number) {
    const deleteUser = this.userRepository.delete({ id: id })
    return deleteUser;
  }

  async getDomicio(id:number){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:id
      },
      relations:['ubicacion']
    });
    return foundUser.ubicacion
  }
  async getDataProfile(idUser:number){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:idUser
      }
    });
    return {
      status:HttpStatus.OK,
      name:foundUser.name +" "+ foundUser.lastname + " " + foundUser.motherLastname,
      email:foundUser.email
    }
  }
  async getDataPersonal(idUser:number){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:idUser
      }
    });
    return{
      status:HttpStatus.OK,
      name:foundUser.name,
      lastname:foundUser.lastname,
      motherLastname:foundUser.motherLastname,
      gender:foundUser.gender,
      birthdate:foundUser.birthdate
    }
  }
  updateUserById(id:number,data:CreateUserDto){
    const {password, ...dataUser} = data;
    if(password){
      console.log("pass")
      this.userRepository.update(id,{
        password:bcryptjs.hashSync(password,10),
        ...dataUser
      });
    }
    else{
      console.log("entra aqui")
      this.userRepository.update(id,data)
    }

    
    return{
      status:HttpStatus.OK,
      message:'Datos actualizados correctamente'
    }
  }
  async getDataCuenta(idUser:number){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:idUser
      }
    });
    return{
      status:HttpStatus.OK,
      email:foundUser.email,
      cellphone:foundUser.cellphone,
    }
  }
  async getDataSeguridad(idUser:number){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:idUser
      },
      relations:['question']
    });
    return{
      status:HttpStatus.OK,
      question:foundUser.question.id,
      answer:foundUser.answer
    }
  }
  async getDataUbicacion(idUser:number){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:idUser
      },
      relations:['ubicacion']
    });
    return{
      status:HttpStatus.OK,
      estado:foundUser.ubicacion.estado,
      municipio:foundUser.ubicacion.municipio,
      colonia:foundUser.ubicacion.colonia,
      cp:foundUser.ubicacion.cp,
      referencia: foundUser.ubicacion.referencia
    }
  }
}
