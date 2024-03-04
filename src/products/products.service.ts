import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product)private producRepository:Repository<Product>){}
  create(createProductDto: CreateProductDto) {
    
    const newProduct = this.producRepository.create(createProductDto);
    return this.producRepository.save(newProduct);
  }

  findAll() {
    return this.producRepository.find();
  }

  findOne(id: number) {
    const product = this.producRepository.findOne({
      where: {
        id: id
      }
    })
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
