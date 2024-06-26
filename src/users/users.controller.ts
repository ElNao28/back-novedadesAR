import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 @Post()
 create(@Body() newUser: CreateUserDto) {
   return this.usersService.createUser(newUser);
 }
  @Get()
  findAll() {
    return this.usersService.getUsers();
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.getUser(email);
  }

 @Patch(':email')
 update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
   return this.usersService.updateUser(email, updateUserDto);
 }
 @Patch('ubicacion/:email')
 updateUbicacion(@Param('email') email: string, @Body() updateUbicacionDto: CreateUbicacionDto) {
   return this.usersService.updateUbicacion(email, updateUbicacionDto);
 }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.DeleteUser(+id);
  }
}