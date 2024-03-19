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
  create(createCarritoDto: CreateCarritoDto) {
    //productIsFound = this.getProductsCardByiD
    const aggNewProduct = this.carritoRepository.create(createCarritoDto)
    this.carritoRepository.save(aggNewProduct);
    return{
      message: 'Producto agregado al carrito',
      status: HttpStatus.OK,
    }
  }

  findAll() {
  }

  getProductsCardByiD(id: number) {
     return this.carritoRepository.findOne({
      where:{
        id
      },
      relations:['detallesCarrito','detallesCarrito.product']
     });
  }

  getProductById(checkCarritoDto:CheckCarritoDto){
    // const productIsFound =  this.carritoRepository.findOne({
    //   where:{
    //     id:checkCarritoDto.idProducto,
    //     usuarioId:checkCarritoDto.idUsurario
    //   }
    // })
    // if(productIsFound){
    //   return true
    // }
  }
  update(id: number, updateCarritoDto: UpdateCarritoDto) {
    return `This action updates a #${id} carrito`;
  }

  remove(id: number) {
    return `This action removes a #${id} carrito`;
  }

}
