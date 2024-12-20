import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() newUser: CreateUserDto) {
    return this.usersService.createUser(newUser);
  }
  @Get()
  findAll() {
    return this.usersService.getUsers();
  }
  @Get('isubicacion/:id')
  checkUbicacion(@Param('id')idUser:string) {
    return this.usersService.checkUbicacion(+idUser);
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.getUser(email);
  }
  @Patch('password/:email')
  updatePassword(@Param('email') email: string, @Body() dataPassword: {password:string,ip:string,fecha:string}) {
    console.log(dataPassword)
    return this.usersService.updatePassword(email,dataPassword);
  }
  @Patch('ubicacion/:id')
  updateUbicacion(@Param('id') idUser: string, @Body() updateUbicacionDto: CreateUbicacionDto) {
    return this.usersService.updateUbicacion(parseInt(idUser), updateUbicacionDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.DeleteUser(+id);
  }
  @Get('ubicacion/:id')
  getUbicacioUser(@Param('id') id: string) {
    let newId = parseInt(id);
    return this.usersService.getDomicio(newId);
  }
  @Get('profile/:id')
  getDataProfile(@Param('id') id: string) {
    return this.usersService.getDataProfile(parseInt(id));
  }
  @Get('profile/personal/:id')
  getDataPersonal(@Param('id') id: string) {
    return this.usersService.getDataPersonal(parseInt(id));
  }
  @Patch('profile/update-user/:id')
  updateUser(@Param('id') id: string,@Body()data:CreateUserDto) {
    return this.usersService.updateUserById(parseInt(id),data);
  }
  @Get('profile/cuenta/:id')
  getDataCuenta(@Param('id') id: string) {
    return this.usersService.getDataCuenta(parseInt(id));
  }
  @Get('profile/seguridad/:id')
  getDataSeguridad(@Param('id') id: string) {
    return this.usersService.getDataSeguridad(parseInt(id));
  }
  @Get('profile/ubicacion/:id')
  getDataUbicacion(@Param('id') id: string) {
    return this.usersService.getDataUbicacion(parseInt(id));
  }
  @Post('dataSet')
  usersDta(@Body()data:{ids:number[]}){
    return this.usersService.getUsersTop(data.ids)
  }
  @Patch('update-photo',)
  updatePhoto(@Body()data:{url:string,id:number}){
    return this.usersService.updatePhoto(data.url,data.id);
  }
}