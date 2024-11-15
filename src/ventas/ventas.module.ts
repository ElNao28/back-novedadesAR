import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetallesVenta } from './entities/detalles_venta.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Envios } from './entities/envios.entity';
import { Comentarios } from 'src/products/entities/comentatios.entity';
import { Chat } from 'src/test-msj/entities/chat.entity';
import { TestMsj } from 'src/test-msj/entities/test-msj.entity';
import { Admin } from "src/admin/entities/admin.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta,User, DetallesVenta,Product,Carrito,Envios,Comentarios,Chat,TestMsj,Admin]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports:[VentasService]
})
export class VentasModule { }
