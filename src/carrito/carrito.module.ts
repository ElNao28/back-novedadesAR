import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { DetallesCarrito } from './entities/detallesCarrito.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Carrito, DetallesCarrito,User,Product])],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}
