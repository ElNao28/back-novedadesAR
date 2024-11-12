import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Rating,User])],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
