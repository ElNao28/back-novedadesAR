import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post('create/:id')
  create(@Param('id')id:string,@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(createRatingDto, +id);
  }
}
