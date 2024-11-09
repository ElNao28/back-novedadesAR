import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Intentos } from './entities/intentos.entity';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';
import { Ubicacion } from './entities/ubicacion.entity';
import { Rol } from './entities/rol.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { PhotoProfile } from './entities/photoProfile.entity';
import { Logs } from './entities/logs.entity';

import * as cloudinary from 'cloudinary';
cloudinary.v2.config({
  cloud_name: 'dy5jdb6tv',
  api_key: '248559475624584',
  api_secret: 'eLssEgrbq41bWTwhhKKpRZK-UBQ',
});

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Intentos)
    private intentosRepository: Repository<Intentos>,
    @InjectRepository(Ubicacion)
    private ubicacionRepository: Repository<Ubicacion>,
    @InjectRepository(Rol) private rolRepository: Repository<Rol>,
    @InjectRepository(Carrito) private cardRepository: Repository<Carrito>,
    @InjectRepository(Logs) private logsRepository: Repository<Logs>,
    @InjectRepository(PhotoProfile)
    private photoRepository: Repository<PhotoProfile>,
  ) {}

  async createUser(userData: CreateUserDto) {
    let dataUbi: CreateUbicacionDto = {
      estado: '',
      municipio: '',
      cp: 0,
      colonia: '',
      referencia: '',
    };

    const foundEmail = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });
    const foundCellphone = await this.userRepository.findOne({
      where: {
        cellphone: userData.cellphone,
      },
    });
    if (foundEmail)
      return {
        message: 'El usuario ya existe',
        status: HttpStatus.CONFLICT,
      };
    if (foundCellphone)
      return {
        message: 'El usuario ya existe',
        status: HttpStatus.CONFLICT,
      };

    const { password, ...userDt } = userData;
    const numeroAleatorio = Math.floor(100000 + Math.random() * 900000);
    const data = {
      codeAlexa: numeroAleatorio.toString(),
      ...userDt,
    };

    const newUser = this.userRepository.create({
      password: bcryptjs.hashSync(password, 10),
      ...data,
    });
    this.userRepository.save(newUser);

    setTimeout(() => {
      this.createTableIntentos(userDt.email);
      this.createUbicacionTable(dataUbi, userDt.email);
      this.addRol(userDt.email);
      this.addCard(userDt.email);
    }, 1000);
    return {
      message: 'Usuario creado correctamente',
      status: HttpStatus.ACCEPTED,
    };
  }
  async createTableIntentos(emailUser: string) {
    const userFound = await this.userRepository.findOne({
      where: {
        email: emailUser,
      },
    });
    if (!userFound) new HttpException('error', HttpStatus.BAD_REQUEST);

    const newIntentos = this.intentosRepository.create({
      intentos: 0,
    });
    const saveIntento = await this.intentosRepository.save(newIntentos);
    userFound.intentos = saveIntento;

    this.userRepository.save(userFound);
  }
  async createUbicacionTable(data: CreateUbicacionDto, emailUser: string) {
    const userFound = await this.userRepository.findOne({
      where: {
        email: emailUser,
      },
    });
    if (!userFound) new HttpException('error', HttpStatus.BAD_REQUEST);

    const newUbicacion = this.ubicacionRepository.create(data);
    const saveUbicacion = await this.ubicacionRepository.save(newUbicacion);

    userFound.ubicacion = saveUbicacion;

    this.userRepository.save(userFound);
  }
  async addRol(emailUser: string) {
    const foundRol = await this.rolRepository.findOne({
      where: {
        rol: 'user',
      },
    });
    const userFound = await this.userRepository.findOne({
      where: {
        email: emailUser,
      },
    });
    this.userRepository.update(userFound.id, {
      rol: foundRol,
    });
  }
  async addCard(emailUser: string) {
    const foundUser = await this.userRepository.findOne({
      where: {
        email: emailUser,
      },
    });
    const createCard = this.cardRepository.create({
      usuario: foundUser,
    });
    this.cardRepository.save(createCard);
  }
  async getUsers() {
    const users = await this.userRepository.find({});
    const result = users.map((data) => ({
      id: data.id,
      name: data.name,
      lastname: data.lastname,
      motherLastname: data.motherLastname,
      gender: data.gender,
      email: data.email,
      cellphone: data.cellphone,
    }));
    return result;
  }
  getUser(email: string) {
    const user = this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: [
        'carrito',
        'carrito.detallesCarrito',
        'carrito.detallesCarrito.product',
        'logs',
        'ventas',
        'intentos',
        'question',
        'ubicacion',
        'rol',
        'ventas.detallesVenta',
        'ventas.detallesVenta.producto',
      ],
    });
    return user;
  }
  getUserById(id: number) {
    const user = this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    return user;
  }
  async updatePassword(
    email: string,
    updateData: { password: string; ip: string; fecha: string },
  ) {
    const dataUser = await this.getUser(email);
    const { password, ...data } = updateData;
    if (updateData.password) {
      this.userRepository.update(dataUser.id, {
        password: bcryptjs.hashSync(password, 10),
      });
      this.createlogs({
        idUser: dataUser.id,
        accion: 'Actualizacion de contraseña',
        ip: updateData.ip,
        url: 'users/password/:email',
        status: 202,
        fecha: updateData.fecha,
      });
      return {
        message: 'Contraseña se actualizo correctamente',
        status: HttpStatus.ACCEPTED,
      };
    }
  }
  async updateUbicacion(idUser: number, dataUbic: CreateUbicacionDto) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
      relations: ['ubicacion'],
    });

    if (!foundUser) return new HttpException('error', HttpStatus.FOUND);
    this.ubicacionRepository.update(foundUser.ubicacion.id, dataUbic);
    return {
      message: 'se actualizo correctamente',
      status: HttpStatus.OK,
    };
  }
  async getIntentos(idUser: number) {
    const dataUser = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
      relations: ['intentos'],
    });
    const intentosUser = await this.intentosRepository.findOne({
      where: {
        id: dataUser.intentos.id,
      },
    });
    return intentosUser.intentos;
  }
  DeleteUser(id: number) {
    const deleteUser = this.userRepository.delete({ id: id });
    return deleteUser;
  }
  async getDomicio(id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['ubicacion'],
    });
    return foundUser.ubicacion;
  }
  async getDataProfile(idUser: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
      relations: ['photo'],
    });
    return {
      status: HttpStatus.OK,
      name:
        foundUser.name +
        ' ' +
        foundUser.lastname +
        ' ' +
        foundUser.motherLastname,
      email: foundUser.email,
      url_photo: foundUser.photo.url,
    };
  }
  async getDataPersonal(idUser: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
    });
    return {
      status: HttpStatus.OK,
      name: foundUser.name,
      lastname: foundUser.lastname,
      motherLastname: foundUser.motherLastname,
      gender: foundUser.gender,
      birthdate: foundUser.birthdate,
    };
  }
  async updateUserById(id: number, data: CreateUserDto) {
    const { password, ...dataUser } = data;
    if (password) {
      this.userRepository.update(id, {
        password: bcryptjs.hashSync(password, 10),
        ...dataUser,
      });
    } else {
      if (data.email) {
        const foundEmail = await this.userRepository.findOne({
          where: {
            email: data.email,
          },
        });
        if (foundEmail && foundEmail.id !== id)
          return {
            status: HttpStatus.CONFLICT,
            message: 'Conflicto',
          };
        const foundNumber = await this.userRepository.findOne({
          where: {
            cellphone: data.cellphone,
          },
        });
        if (foundNumber && foundNumber.id !== id)
          return {
            status: HttpStatus.CONFLICT,
            message: 'Conflicto',
          };
      }
      this.userRepository.update(id, data);
    }
    console.log(data);
    this.userRepository.update(id, data);
    return {
      status: HttpStatus.OK,
      message: 'Datos actualizados correctamente',
    };
  }
  async getDataCuenta(idUser: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
    });
    return {
      status: HttpStatus.OK,
      email: foundUser.email,
      cellphone: foundUser.cellphone,
    };
  }
  async getDataSeguridad(idUser: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
      relations: ['question'],
    });
    return {
      status: HttpStatus.OK,
      question: foundUser.question.id,
      answer: foundUser.answer,
    };
  }
  async getDataUbicacion(idUser: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: idUser,
      },
      relations: ['ubicacion'],
    });
    return {
      status: HttpStatus.OK,
      estado: foundUser.ubicacion.estado,
      municipio: foundUser.ubicacion.municipio,
      colonia: foundUser.ubicacion.colonia,
      cp: foundUser.ubicacion.cp,
      referencia: foundUser.ubicacion.referencia,
    };
  }
  async createlogs(data: {
    idUser: number;
    accion: string;
    ip: string;
    url: string;
    status: number;
    fecha: string;
  }) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: data.idUser,
      },
    });
    const newLog = this.logsRepository.create({
      accion: data.accion,
      ip: data.ip,
      url_solicitada: data.url,
      status: data.status,
      usuario: foundUser,
      fecha: data.fecha,
    });
    this.logsRepository.save(newLog);
  }
  async checkUbicacion(id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['ubicacion'],
    });
    if (foundUser.ubicacion.estado === '')
      return {
        message: 'no cuenta con una ubicacion',
        status: HttpStatus.NOT_FOUND,
      };
    return {
      message: 'Cuenta con unbicacion',
      status: HttpStatus.OK,
    };
  }
  async getUsersTop(user: number[]) {
    let usersData = [];
    for (let i = 0; i < user.length; i++) {
      const foundUsers = await this.userRepository.findOne({
        where: {
          id: user[i],
        },
      });
      if (foundUsers) {
        usersData.push(foundUsers);
      }
    }
    return {
      message: 'Exito',
      status: HttpStatus.OK,
      data: usersData,
    };
  }

  async updatePhoto(data: string, id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['photo'],
    });
    if (!foundUser) {
      return {
        message: 'Usuario no encontrado',
        status: HttpStatus.NOT_FOUND,
      };
    }
    const uploadResult = await cloudinary.v2.uploader.upload(`${data}`, {
      folder: 'photo',
    });
    if (foundUser.photo) {
      console.log('Entra aqui');
      const idPhoto = foundUser.photo.url;
      const idImg = idPhoto.split("/")[8].split(".")[0];
      await cloudinary.v2.api
        .delete_resources(
          [`photo/${idImg}`],
          { type: 'upload', resource_type: 'image' },
        )
      await this.photoRepository.update(foundUser.photo.id, {
        url: uploadResult.secure_url,
      });
      return {
        message: 'exito',
        status: HttpStatus.OK,
      };
    }
    console.log('Entra en el nuevo');

    const newPhoto = this.photoRepository.create({
      url: uploadResult.secure_url,
    });
    const savePhoto = await this.photoRepository.save(newPhoto);
    await this.userRepository.update(id, {
      photo: savePhoto,
    });
    return {
      message: 'exito',
      status: HttpStatus.OK,
    };
  }
}
