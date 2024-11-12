import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createRatingDto: CreateRatingDto, id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (foundUser) {
      const newRating = this.ratingRepository.create({
        usuario:foundUser,
        ...createRatingDto
      });
      await this.ratingRepository.save(newRating);
      this.userRepository.update(id,{
        isRating:true
      });

    }
    return {
      message: 'Exito',
      status: HttpStatus.OK,
    };
  }
}
