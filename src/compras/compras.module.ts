import { Module } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entities/compra.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Compra]),
    UsersModule],
  controllers: [ComprasController],
  providers: [ComprasService],
})
export class ComprasModule {}
