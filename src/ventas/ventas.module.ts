import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetallesVenta } from './entities/detalles_venta.entity';
import { Envios } from './entities/envios.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, DetallesVenta, Envios,Product,User,Carrito])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule { }
