import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecoverPasswordService } from './recover-password.service';
import { CreateRecoverPasswordDto } from './dto/create-recover-password.dto';

@Controller('recover-password')
export class RecoverPasswordController {
  constructor(private readonly recoverPasswordService: RecoverPasswordService) {}

  @Post()
  validData(@Body() createRecoverPasswordDto: CreateRecoverPasswordDto) {
    return this.recoverPasswordService.checkData(createRecoverPasswordDto);
  }
}
