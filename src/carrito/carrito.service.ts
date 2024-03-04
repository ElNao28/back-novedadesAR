import { Injectable } from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarritoService {
  constructor(@InjectRepository(Carrito) private carritoRepository:Repository<Carrito>) {}
  create(createCarritoDto: CreateCarritoDto) {
    const aggNewProduct = this.carritoRepository.create(createCarritoDto)
    return this.carritoRepository.save(aggNewProduct);
  }

  findAll() {
  }

  getProductsCardByiD(id: number) {
    return this.carritoRepository.find({
      where:{
        usuarioId:id
      }
    });
  }

  update(id: number, updateCarritoDto: UpdateCarritoDto) {
    return `This action updates a #${id} carrito`;
  }

  remove(id: number) {
    return `This action removes a #${id} carrito`;
  }
}
