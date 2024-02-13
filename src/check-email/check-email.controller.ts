import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CheckEmailService } from './check-email.service';
import { CreateCheckEmailDto } from './dto/create-check-email.dto';
import { UpdateCheckEmailDto } from './dto/update-check-email.dto';

@Controller('check-email')
export class CheckEmailController {
  constructor(private readonly checkEmailService: CheckEmailService) {}

  @Post()
  create(@Body() createCheckEmailDto: CreateCheckEmailDto) {
    return this.checkEmailService.checkData(createCheckEmailDto);
  }
}
