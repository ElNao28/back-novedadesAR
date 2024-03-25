import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Imagenes } from './entities/imagenes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Imagenes])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
