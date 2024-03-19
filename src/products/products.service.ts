import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import MercadoPagoConfig, { Preference } from 'mercadopago';
// Configura la API key y secret key de Cloudinary
cloudinary.v2.config({
  cloud_name: 'dy5jdb6tv',
  api_key: '248559475624584',
  api_secret: 'eLssEgrbq41bWTwhhKKpRZK-UBQ'
});

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private producRepository: Repository<Product>) { }

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {

    console.log(file);

    try {

      const { imagen, ...data } = createProductDto

      // Crea un archivo temporal con el buffer del archivo
      const filePath = path.join(os.tmpdir(), file.originalname);
      fs.writeFileSync(filePath, file.buffer);

      // se sube la imagen a Cloudinary
      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: 'tu-carpeta',
        resource_type: 'image'
      });

      // Elimina el archivo temporal después de subirlo a Cloudinary
      fs.unlinkSync(filePath);

      console.log(result);
      const newProduct = this.producRepository.create({
        imagen: result.secure_url,
        ...data
      });

      return this.producRepository.save(newProduct);
    } catch (error) 
    {
      console.error(error);
      throw new HttpException('Error al subir la imagen a Cloudinary', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return this.producRepository.find();
  }

  findOne(id: number) {
    const product = this.producRepository.findOne({
      where: {
        id: id
      }
    })
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async formPago(res: ResDto) {
    let url = "";
    const client = new MercadoPagoConfig({
      accessToken: 'TEST-3954097920512827-030816-523113fab0eca51c8a57d53e2cf509d6-1719432312'
    });

    const preference = new Preference(client);

    await preference.create({
      body: {
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [
            {
              id: "credit_card"
            },
            {
              id: "bank_transfer"
            },
            {
              id: "ticket"
            }
          ],
          installments: 1
        },
        items: [
          {
            id: res.id,
            title: res.title,
            quantity: 1,
            unit_price: res.precio
          }
        ],
        back_urls: {
          success: 'http://localhost:4200/inicio',
          failure: 'http://localhost:3000/failure',
          pending: 'http://localhost:3000/pending'
        }
      }
    })
      .then(res => {
        console.log(res.sandbox_init_point)
        url = res.sandbox_init_point
      })
      .catch();
      return {
        url:url
      }
  }
}
