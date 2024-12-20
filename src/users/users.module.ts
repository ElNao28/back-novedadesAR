import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Intentos } from './entities/intentos.entity';
import { Logs } from './entities/logs.entity';
import { Question } from './entities/question.entity';
import { Rol } from './entities/rol.entity';
import { Ubicacion } from './entities/ubicacion.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity'
import { PhotoProfile } from './entities/photoProfile.entity';

@Module({
  imports:[TypeOrmModule.forFeature([
    User,Intentos, Logs, Question,Rol,Ubicacion,Carrito,PhotoProfile
  ]),],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService] 
})
export class UsersModule {}