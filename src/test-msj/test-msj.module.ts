import { Module } from '@nestjs/common';
import { TestMsjService } from './test-msj.service';
import { TestMsjGateway } from './test-msj.gateway';

@Module({
  providers: [TestMsjGateway, TestMsjService],
})
export class TestMsjModule {}
