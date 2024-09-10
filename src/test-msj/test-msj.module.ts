import { Module } from '@nestjs/common';
import { TestMsjService } from './test-msj.service';
import { TestMsjGateway } from './test-msj.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import { TestMsj } from './entities/test-msj.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Venta,User,Chat,TestMsj])],
  providers: [TestMsjGateway, TestMsjService]
})
export class TestMsjModule {}
