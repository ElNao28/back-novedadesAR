import { HttpException, HttpStatus, Inject, Injectable, Get } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as cloudinary from 'cloudinary';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ResDto } from './dto/res.dto';
import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';
import { VentasService } from 'src/ventas/ventas.service';
import { User } from 'src/users/entities/user.entity';
import { Items } from './entities/Items.interface';
// Configura la API key y secret key de Cloudinary
cloudinary.v2.config({
  cloud_name: 'dy5jdb6tv',
  api_key: '248559475624584',
  api_secret: 'eLssEgrbq41bWTwhhKKpRZK-UBQ'
});
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private producRepository: Repository<Product>,
    private ventasService: VentasService) { }

  // async create(createProductDto: CreateProductDto, file: Express.Multer.File) {

  //   console.log(file);

  //   try {

  //     const {  ...data } = createProductDto

  //     // Crea un archivo temporal con el buffer del archivo
  //     const filePath = path.join(os.tmpdir(), file.originalname);
  //     fs.writeFileSync(filePath, file.buffer);

  //     // se sube la imagen a Cloudinary
  //     const result = await cloudinary.v2.uploader.upload(filePath, {
  //       folder: 'tu-carpeta',
  //       resource_type: 'image'
  //     });
 
  //     // Elimina el archivo temporal después de subirlo a Cloudinary
  //     fs.unlinkSync(filePath);

  //     console.log(result);
  //     const newProduct = this.producRepository.create({
  //       imagenn: result.secure_url,
  //       ...data
  //     });

  //     return this.producRepository.save(newProduct);
  //   } catch (error) 
  //   {
  //     console.error(error);
  //     throw new HttpException('Error al subir la imagen a Cloudinary', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  findAll() {
    return this.producRepository.find({
      where: {
        status: "activo"
      },
      relations: ['imagen']
    },);
  }

  findOne(id: number) {
    const product = this.producRepository.findOne({
      where: {
        id: id
      },
      relations: ['imagen']
    })
    return product;
  }
  async formPago(res: ResDto[]) {
    let url = "";
    const client = new MercadoPagoConfig({
      accessToken: 'TEST-3954097920512827-030816-523113fab0eca51c8a57d53e2cf509d6-1719432312'
    });

    const preference = new Preference(client);
    const products: Items[] = []
    for (let i = 0; i < res.length; i++) {
      products.push({
        id: res[i].id,
        title: res[i].title,
        quantity: parseInt(res[i].cantidad),
        unit_price: res[i].precio,
        description: "ola"
      })
    }
    await preference.create({
      body: {
        payment_methods: { 
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 1
        },
        items: products,
        back_urls: {
          success: 'http://localhost:4200/inicio',
          failure: 'http://localhost:3000/failure',
          pending: 'http://localhost:3000/pending'
        },
        notification_url: 'https://d033-187-249-108-42.ngrok-free.app/products/res-pago/' + res[0].idUser + '/card/' + res[0].idCard
      }
    })
      .then(res => {
        url = res.sandbox_init_point;
      })
      .catch(err => {
        console.log(err)
      });
    return {
      url: url
    }
  }
  async checkPayment(data:number,idUser:string,idCard:string) {
    const client = new MercadoPagoConfig({
      accessToken: 'TEST-3954097920512827-030816-523113fab0eca51c8a57d53e2cf509d6-1719432312'
    });
    if(data){
    const pago = await new Payment(client).capture({ id: data });
    console.log(pago)
    if (pago.status === 'approved') {
      this.ventasService.addVenta(parseInt(idUser),pago.additional_info.items,idCard,pago.transaction_details.total_paid_amount,pago.date_approved);
    }
  }
}
}
