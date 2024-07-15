import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Imagenes } from './entities/imagenes.entity';
import { VentasService } from 'src/ventas/ventas.service';
import { Venta } from '../ventas/entities/venta.entity';
import { DetallesVenta } from 'src/ventas/entities/detalles_venta.entity';
import { User } from 'src/users/entities/user.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Comentarios } from './entities/comentatios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Imagenes,Venta,User,DetallesVenta,Carrito,Comentarios])],
  controllers: [ProductsController],
  providers: [ProductsService,VentasService],
})
export class ProductsModule {}
