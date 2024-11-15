import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StripeService } from './stripe.service';


@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async create(@Body() createStripeDto) {
    console.log(createStripeDto);
    return this.stripeService.pagoStripe(createStripeDto);
  }
}
