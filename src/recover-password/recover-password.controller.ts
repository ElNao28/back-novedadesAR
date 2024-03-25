import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecoverPasswordService } from './recover-password.service';
import { CreateRecoverPasswordDto } from './dto/create-recover-password.dto';
import { CheckAnswer } from './interface/checkAnswer.interface';

@Controller('recover-password')
export class RecoverPasswordController {
  constructor(private readonly recoverPasswordService: RecoverPasswordService) {}

  @Post()
  validData(@Body() createRecoverPasswordDto: CreateRecoverPasswordDto) {
    return this.recoverPasswordService.checkData(createRecoverPasswordDto);
  }

  @Get(':email')
  checkQuestionByEmail(@Param('email') email: string){
    return this.recoverPasswordService.checkQuestion(email);
  }

  @Post('answer')
  CheckAnswerByEmail(@Body() checkAnswer:CheckAnswer){
    return this.recoverPasswordService.checkAnswer(checkAnswer)
  }
}
