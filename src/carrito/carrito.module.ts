import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { DetallesCarrito } from './entities/detallesCarrito.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Carrito, DetallesCarrito])],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}
