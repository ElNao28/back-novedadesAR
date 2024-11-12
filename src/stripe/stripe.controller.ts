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
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';

const stripe = require('stripe')('sk_test_51Os6QyP0xF5rSbalHiltPXqBNbewYYo0T3P02CikwxwUFGLXZqnfNoHZyC8P03TWCTUxypvbrTQqigaWoWx5ctlf00XocCc2bt');

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async create(@Body() createStripeDto: CreateStripeDto) {
    console.log("llegaa aqui")
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2024-10-28.acacia' },
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'mxn',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51Os6QyP0xF5rSbalhCDVxAhQAHMJJLSQsgR9JRdjUrd1MQHuWDxzNNFP84btqgdlTAniH5bX6NEX31jctM7CGuYC00OYXvGDI7',
    }
  }

  @Get()
  findAll() {
    return this.stripeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStripeDto: UpdateStripeDto) {
    return this.stripeService.update(+id, updateStripeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripeService.remove(+id);
  }
}
