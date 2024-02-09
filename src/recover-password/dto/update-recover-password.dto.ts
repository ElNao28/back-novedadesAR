import { PartialType } from '@nestjs/mapped-types';
import { CreateRecoverPasswordDto } from './create-recover-password.dto';

export class UpdateRecoverPasswordDto extends PartialType(CreateRecoverPasswordDto) {}
