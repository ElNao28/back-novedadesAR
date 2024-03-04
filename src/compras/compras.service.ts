import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra) private compraRepository:Repository<Compra>,
    private userService:UsersService
    ){}
  async create(createCompraDto: CreateCompraDto) {
    const userFound = await this.userService.getUserById(createCompraDto.usuarioId);
    if(!userFound)return new HttpException('No user found', HttpStatus.NOT_FOUND)
    const newCompra = this.compraRepository.create(createCompraDto)

    return this.compraRepository.save(newCompra);
  }

  findAll() {
    return this.compraRepository.find({
      relations: ['usuario']
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} compra`;
  }

  update(id: number, updateCompraDto: UpdateCompraDto) {
    return `This action updates a #${id} compra`;
  }

  remove(id: number) {
    return `This action removes a #${id} compra`;
  }
}
