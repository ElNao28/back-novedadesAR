import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Repository } from 'typeorm';
import { CheckCarritoDto } from './dto/check-carrito.dto';
@Injectable()
export class CarritoService {
  constructor(@InjectRepository(Carrito) private carritoRepository:Repository<Carrito>) {}

}
