import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { VentasService } from 'src/ventas/ventas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';
import { VentasModule } from 'src/ventas/ventas.module';

@Module({
  imports:[VentasModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
