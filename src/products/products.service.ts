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
import { Imagenes } from './entities/imagenes.entity';
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
    @InjectRepository(Imagenes) private imagenesRepository: Repository<Imagenes>,
    private ventasService: VentasService) { }

  async create(createProductDto: CreateProductDto, file: { imagen?: Express.Multer.File[] }) {

    try {

      const newProduct = this.producRepository.create(createProductDto);
      const productSave = await this.producRepository.save(newProduct);


      for (let i = 0; i < file.imagen.length; i++) {
        // Crea un archivo temporal con el buffer del archivo
        const filePath = path.join(os.tmpdir(), file.imagen[i].originalname);
        fs.writeFileSync(filePath, file.imagen[i].buffer);
        // se sube la imagen a Cloudinary
        const result = await cloudinary.v2.uploader.upload(filePath, {
          folder: 'tu-carpeta',
          resource_type: 'image'
        }); 
        // Elimina el archivo temporal después de subirlo a Cloudinary
        fs.unlinkSync(filePath);

        const newImagen = this.imagenesRepository.create({
          url_imagen: result.secure_url,
          producto: productSave
        })
        this.imagenesRepository.save(newImagen)
      }
      return {
        message: "Producto creado exitosamente",
        status: HttpStatus.OK
      }
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al subir la imagen a Cloudinary', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updateProduct(updateProductDto:UpdateProductDto,id:number){
    const foundProduct = await this.producRepository.findOne({
      where:{
        id
      }
    });
    if(!foundProduct) return{
      message: 'Producto no encontrado',
      status: HttpStatus.NOT_FOUND
    }
    await this.producRepository.update(id,updateProductDto)
    return{
      message:'Producto actualizado',
      status:HttpStatus.OK
    }
  }
  findAll() {
    return this.producRepository.find({
      where: {
        status: "activo"
      },
      relations: ['imagen']
    },);
  }

  findAllProducts(){
    return this.producRepository.find({
      relations:['imagen']
    })
  }
  async findOne(id: number) {
    let comentarios = [];
    const product = await this.producRepository.findOne({
      where: {
        id: id
      },
      relations: ['imagen', 'comentarios', 'comentarios.usuario']
    })
    for (let i = 0; i < product.comentarios.length; i++) {
      comentarios.push(
        {
          comentario: product.comentarios[i].comentario,
          fecha: product.comentarios[i].fecha,
          usuario: product.comentarios[i].usuario.name + " " + product.comentarios[i].usuario.lastname + " " + product.comentarios[i].usuario.motherLastname
        }
      )
    }
    return {
      id: product.id,
      nombre_producto: product.nombre_producto,
      precio: product.precio,
      descripccion: product.descripccion,
      stock: product.stock,
      categoria: product.categoria,
      rating: product.rating,
      descuento: product.descuento,
      status: product.status,
      tipo: product.tipo,
      imagen: product.imagen,
      comentarios: comentarios
    };
  }
  async formPago(res: ResDto[]) {
    let url = "";
    const client = new MercadoPagoConfig({
      accessToken: 'TEST-3954097920512827-030816-523113fab0eca51c8a57d53e2cf509d6-1719432312'
    });

    const payment = new Payment(client)

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
          excluded_payment_types: [
          ],
          installments: 1
        },
        items: products,
        back_urls: {
          success: 'http://localhost:4200/inicio',
          failure: 'http://localhost:3000/failure',
          pending: 'http://localhost:3000/pending'
        },
        notification_url: 'https://b7c2-187-249-108-43.ngrok-free.app/' + res[0].idUser + '/card/' + res[0].idCard
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
  async checkPayment(data: number, idUser: string, idCard: string) {
    const client = new MercadoPagoConfig({
      accessToken: 'TEST-3954097920512827-030816-523113fab0eca51c8a57d53e2cf509d6-1719432312'
    });
    if (data) {
      const pago = await new Payment(client).capture({ id: data });
      console.log(pago)
      if (pago.status === 'approved') {
        this.ventasService.addVenta(parseInt(idUser), pago.additional_info.items, idCard, pago.transaction_details.total_paid_amount, pago.date_approved);
      }
    }
  }
  async getProductByCategory(type: string) {
    const foundProducts = await this.producRepository.find({
      where: {
        categoria: type
      }
    });
    return foundProducts;
  }

  async getProductByFilter(datos: { dama: boolean, caballero: boolean, datos: [] }) {
    let productsFilter = [];
    let productsSend = [];
    for (let i = 0; i < datos.datos.length; i++) {
      const foundProducts = await this.producRepository.find({
        where: {
          tipo: datos.datos[i]
        },
        relations: ['imagen']
      });
      if (foundProducts) {
        for (let i = 0; i < foundProducts.length; i++) {
          let product = {
            id: foundProducts[i].id,
            nombre_producto: foundProducts[i].nombre_producto,
            precio: foundProducts[i].precio,
            descripccion: foundProducts[i].descripccion,
            stock: foundProducts[i].stock,
            categoria: foundProducts[i].categoria,
            rating: foundProducts[i].rating,
            descuento: foundProducts[i].descuento,
            status: foundProducts[i].status,
            tipo: foundProducts[i].tipo,
            imagen: foundProducts[i].imagen
          }
          productsFilter.push(product);
        }
      }
    }
    if (datos.caballero === true && datos.dama === false) {
      if (productsFilter.length === 0) {
        return this.producRepository.find({
          where: {
            categoria: 'H'
          },
          relations: ['imagen']
        })
      }
      for (let i = 0; i < productsFilter.length; i++) {
        if (productsFilter[i].categoria === 'H') {
          productsSend.push(productsFilter[i]);
        }
      }
      return productsSend;
    }
    else if (datos.caballero === false && datos.dama === true) {
      if (productsFilter.length === 0) {
        return this.producRepository.find({
          where: {
            categoria: 'M'
          },
          relations: ['imagen']
        })
      }
      for (let i = 0; i < productsFilter.length; i++) {
        if (productsFilter[i].categoria === 'M') {
          productsSend.push(productsFilter[i]);
        }
      }
      return productsSend;
    }
    else {
      return this.producRepository.find({
        relations: ['imagen']
      })
    }
  }
  getProductsByGender(gender: string, tipo: string) {
    return this.producRepository.find({
      where: {
        categoria: gender,
        tipo: tipo
      },
      relations: ['imagen']
    })
  }
  async alterStatusProduct(id:number,action:boolean){
    const foundProduct = await this.producRepository.findOne({
      where:{
        id
      }
    });
    if(!foundProduct)return{
      message:'not found',
      status:HttpStatus.NOT_FOUND
    }
    if(action === true){
    if(foundProduct.stock <= 0) return{
      message:'No hay stock suficiente',
      status:HttpStatus.BAD_REQUEST
    }
     await this.producRepository.update(id,{
      status:'activo'
     });
    }
    else{
      await this.producRepository.update(id,{
        status:'inactivo'
      });
    }
    return{
      message:'Status actualizado',
      status:HttpStatus.OK
    }
  }
}
