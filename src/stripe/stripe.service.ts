import { Injectable } from '@nestjs/common';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VentasService } from 'src/ventas/ventas.service';
import { ResDto } from 'src/products/dto/res.dto';

const stripe = require('stripe')(
  'sk_test_51Os6QyP0xF5rSbalHiltPXqBNbewYYo0T3P02CikwxwUFGLXZqnfNoHZyC8P03TWCTUxypvbrTQqigaWoWx5ctlf00XocCc2bt',
);

@Injectable()
export class StripeService {
  constructor(private ventasService: VentasService) {}
  async pagoStripe(data: ResDto[]) {

    let itemsVenta = [];
    itemsVenta = data.map((item) => {
      return {
        idProducto: item.id,
        cantidad: item.cantidad,
      };
    });
    let total = 0;
    if(data.length === 1){
      total = data[0].precio * +data[0].cantidad;
    }
    else{
      data.forEach((data) => {
        total = data.precio += data.precio;
      });
    }
    console.log(total)
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2024-10-28.acacia' },
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 1000,
      currency: 'mxn',
      customer: customer.id,
    });
    this.ventasService.addVentaStripe(
      +data[0].idUser,
      itemsVenta,
      total,
      data[0].idCard,
      paymentIntent.id,
    );
    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        'pk_test_51Os6QyP0xF5rSbalhCDVxAhQAHMJJLSQsgR9JRdjUrd1MQHuWDxzNNFP84btqgdlTAniH5bX6NEX31jctM7CGuYC00OYXvGDI7',
    };
  }
}
