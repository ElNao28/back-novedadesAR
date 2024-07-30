import { PartialType } from '@nestjs/mapped-types';
import { CreateTestMsjDto } from './create-test-msj.dto';

export class UpdateTestMsjDto extends PartialType(CreateTestMsjDto) {
  id: number;
}
