import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetallesVenta } from './entities/detalles_venta.entity';
import { Envios } from './entities/envios.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Venta, DetallesVenta,Envios])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
 