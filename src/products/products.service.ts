import { HttpException, HttpStatus, Inject, Injectable, Get } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThan, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import * as cloudinary from 'cloudinary';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { ResDto } from './dto/res.dto';
import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';
import { VentasService } from 'src/ventas/ventas.service';
import { Items } from './entities/Items.interface';
import { Imagenes } from './entities/imagenes.entity';
import { Comentarios } from './entities/comentatios.entity';
import { User } from 'src/users/entities/user.entity';
import { catchError, map } from 'rxjs/operators';

import Stripe from 'stripe';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { throwError } from 'rxjs';
import { Venta } from 'src/ventas/entities/venta.entity';
import { DetallesVenta } from 'src/ventas/entities/detalles_venta.entity';
import { all } from 'axios';
const stripe = new Stripe('sk_test_51Os6QyP0xF5rSbalHiltPXqBNbewYYo0T3P02CikwxwUFGLXZqnfNoHZyC8P03TWCTUxypvbrTQqigaWoWx5ctlf00XocCc2bt');

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
    @InjectRepository(Comentarios) private comentariosRepository: Repository<Comentarios>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Venta) private ventaRepository: Repository<Venta>,
    @InjectRepository(DetallesVenta) private detallesVentaRepository: Repository<DetallesVenta>,
    private httpService: HttpService,
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
  async updateProduct(updateProductDto: UpdateProductDto, id: number) {
    const foundProduct = await this.producRepository.findOne({
      where: {
        id
      }
    });
    if (!foundProduct) return {
      message: 'Producto no encontrado',
      status: HttpStatus.NOT_FOUND
    }
    await this.producRepository.update(id, updateProductDto)
    return {
      message: 'Producto actualizado',
      status: HttpStatus.OK
    }
  }
  findAll() {
    return this.producRepository.find({
      where: {
        status: "activo"
      },
      order: {
        id: 'DESC'
      },
      relations: ['imagen']
    },);
  }
  async findNovedades() {
    let productsWithDes = [];
    const nuevo = await this.producRepository.find({
      where: { 
        status: "activo"
      },
      order: {
        id: 'DESC'
      },
      take: 9,
      relations: ['imagen']
    });
    const descuento = await this.producRepository.find({
      where: {
        status: 'activo'
      },
      relations: ['imagen']
    });
    descuento.forEach(product => {
      if (productsWithDes.length >= 9) {
        return productsWithDes
      }
      if (product.descuento > 0) {
        productsWithDes.push(product)
      }
    });

    const dama = await this.producRepository.find({
      where: {
        status: 'activo',
        categoria: 'M'
      },
      order: {
        id: 'DESC'
      },
      take: 9,
      relations: ['imagen']
    });
    const caballero = await this.producRepository.find({
      where: {
        status: 'activo',
        categoria: 'H',
      },
      order: {
        id: 'DESC'
      },
      take: 9,
      relations: ['imagen']
    });

    return {
      message: 'exito',
      status: HttpStatus.OK,
      novedades: nuevo,
      descuento: productsWithDes,
      dama: dama,
      caballero: caballero
    }

  }
  async findProductsByPage(page: number) {
    let limit: number = 12
    const foundProducts = await this.producRepository.findAndCount({
      where: {
        status: "activo"
      },
      order: {
        id: 'DESC'
      },
      take: limit,
      skip: (page) * limit,
      relations: ['imagen']
    })
    return {
      message: 'exito',
      status: HttpStatus.OK,
      data: foundProducts
    }
  }
  findAllProducts() {
    return this.producRepository.find({
      relations: ['imagen']
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
    if (!product) return {
      message: 'No encontrado',
      status: HttpStatus.NOT_FOUND
    }
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
  async findOneProduct(id: number) {
    let comentarios = [];
    const product = await this.producRepository.findOne({
      where: {
        id: id
      },
      relations: ['imagen', 'comentarios', 'comentarios.usuario']
    })
    if (!product) return {
      message: 'No encontrado',
      status: HttpStatus.NOT_FOUND
    }
    if (product.status === 'inactivo') return {
      message: 'No encontrado',
      status: HttpStatus.NOT_FOUND
    }
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
      message: 'Exito',
      status: HttpStatus.OK,
      data: {
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
      }
    };
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
          excluded_payment_types: [
          ],
          installments: 1
        },
        //items: products,
        items: [
          {
            id: '1',
            title: 'prueba',
            quantity: 1,
            unit_price: 100,
            description: "ola"
          }
        ],
        back_urls: {
          success: 'https://novedades-ar.netlify.app/#/inicio',
          failure: 'http://localhost:4200/inicio',
          pending: 'http://localhost:4200/inicio'
        },
        //https://back-novedadesar-production.up.railway.app https://8831-187-249-108-43.ngrok-free.app 
        notification_url: 'https://4c48-201-162-250-184.ngrok-free.app/products/res-pago/' + res[0].idUser + '/card/' + res[0].idCard
      }
    })
      .then(res => {
        url = res.sandbox_init_point;
      })
      .catch(err => {
        console.log(err, 'error')
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
          tipo: datos.datos[i],
          status:'activo'
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
      for (let i = 0; i < productsFilter.length; i++) {
        if (productsFilter[i].categoria === 'H') {
          productsSend.push(productsFilter[i]);
        }
      }
      return productsSend.slice();
    }
    else if (datos.caballero === false && datos.dama === true) {
      for (let i = 0; i < productsFilter.length; i++) {
        if (productsFilter[i].categoria === 'M') {
          productsSend.push(productsFilter[i]);
        }
      }
      return productsSend;
    }
    else {
      productsSend = productsFilter;
      return productsSend
    }
  }
  getProductsByGender(gender: string, tipo: string) {
    return this.producRepository.find({
      where: {
        categoria: gender,
        tipo: tipo,
        status:'activo'
      },
      relations: ['imagen']
    })
  }
  async alterStatusProduct(id: number, action: boolean) {
    const foundProduct = await this.producRepository.findOne({
      where: {
        id
      }
    });
    if (!foundProduct) return {
      message: 'not found',
      status: HttpStatus.NOT_FOUND
    }
    if (action === true) {
      if (foundProduct.stock <= 0) return {
        message: 'No hay stock suficiente',
        status: HttpStatus.BAD_REQUEST
      }
      await this.producRepository.update(id, {
        status: 'activo'
      });
    }
    else {
      await this.producRepository.update(id, {
        status: 'inactivo'
      });
    }
    return {
      message: 'Status actualizado',
      status: HttpStatus.OK
    }
  }
  async getProductsByDescuento() {
    let productsWithDes = [];
    const products = await this.producRepository.find({
      where: {
        status: 'activo'
      },
      relations: ['imagen']
    });
    products.forEach(product => {
      if (product.descuento > 0) {
        productsWithDes.push(product)
      }
    });

    return {
      message: 'exito',
      status: HttpStatus.OK,
      data: productsWithDes
    }
  }
  async updateDescuento(id: number, descuento: number) {
    const foundProduct = await this.producRepository.findOneBy({ id })
    if (!foundProduct) return {
      message: 'Producto no encontrado',
      status: HttpStatus.NOT_FOUND
    }
    await this.producRepository.update(id, {
      descuento
    });
    return {
      message: 'exito',
      status: HttpStatus.OK
    }
  }
  async updateStock(id: number, stock: number) {
    const foundProduct = await this.producRepository.findOneBy({ id })
    if (!foundProduct) return {
      message: 'Producto no encontrado',
      status: HttpStatus.NOT_FOUND
    }
    await this.producRepository.update(id, {
      stock
    });
    return {
      message: 'exito',
      status: HttpStatus.OK
    }
  }
  async pagoStripe(data: ResDto[]) {
    let url: string = '';
    let items = [];
    let itemsVenta = [];
    items = data.map(data => {
      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: data.title,
          },
          unit_amount: data.precio * 100,
        },
        quantity: data.cantidad,

      }
    })
    itemsVenta = data.map(data => {
      return {
        idProducto: data.id,
        cantidad: data.cantidad
      }
    })
    await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: 'https://novedades-ar.netlify.app/#/full',
      cancel_url: 'https://novedades-ar.netlify.app/#/inicio',
      expires_at: Math.floor(Date.now() / 1000) + 1800

    }).then(session => {
      url = session.url
      let total = 0;
      data.forEach(data => {
        total = data.precio * data.precio
      });
      //const idUser = this.jwtService.decode(data[0].idUser)
      this.ventasService.addVentaStripe(+data[0].idUser, itemsVenta, total, data[0].idCard, session.id)
    }).catch(error => {
      console.error(error);
    });
    return {
      url
    }
  }
  async savePago(idSession: string) {
    this.ventasService.confirmVenta(idSession)
  }
  async getProductByTypeUser(typeUser: number) {
    try {
      const foundUser = await this.userRepository.findOne({
        where: {
          id: typeUser
        }
      });
      const ventas = await this.ventaRepository.find({
        where: {
          usuario: foundUser
        },
        order: {
          id: 'DESC'
        },
        take: 2
      });
      const detalleVenta = await this.detallesVentaRepository.find({
        where: {
          venta: ventas[0]
        },
        relations: ['producto'],
        order: {
          id: 'DESC'
        },
        take: 1
      });
      const ultVenta = detalleVenta[0]
      const payload = {
        descuento: ultVenta.descuento,
        precio: ultVenta.precio,
        categoria: ultVenta.producto.categoria,
        tipo: ultVenta.producto.tipo,
        rating: ultVenta.producto.rating,
        calificacion: ultVenta.calificacion,
        cantidad: ultVenta.cantidad,
        total: ventas[0].total_venta,
        genero: foundUser.gender
      }
      const tipoCliente = await this.httpService.post<{ tipo_cliente: number }>('https://server-m3.onrender.com/predict', payload).pipe(
        map(response => response.data.tipo_cliente),
        catchError(error => {
          console.error('Error occurred:', error);
          return throwError(() => new Error('Error making POST request'));
        })
      ).toPromise();

      let productos;

      switch (tipoCliente) {
        case 0:
          console.log('tipo 0');
          productos = await this.producRepository.find({
            where: {
              descuento: LessThanOrEqual(10),
              precio: LessThan(100),
              rating: LessThanOrEqual(3),
              status:'activo'
            },
            relations:['imagen'],
            take: 9
          });
          break;

        case 1:
          console.log('tipo 1');
          let gender;
          if (foundUser.gender === 'F')
            gender = 'M'
          else
            gender = 'H'
          productos = await this.producRepository.find({
            where: {
              descuento: Between(25, 50),
              precio: Between(180, 500),
              categoria: gender,
              rating: Between(3, 5),
              status:'activo'
            },
            relations:['imagen'],
            take: 9
          });
          break;
        case 2:
          console.log('tipo 2');
          productos = await this.producRepository.find({
            where: {
              descuento: Between(10, 25),
              precio: Between(60, 300),
              rating: MoreThan(4),
              status:'activo'
            },
            relations:['imagen'],
            take: 9
          });
          break;

        default:
          return {
            message: 'Tipo de usuario no válido',
            status: HttpStatus.BAD_REQUEST,
            data: []
          };
      }

      return {
        message: 'Éxito',
        status: HttpStatus.OK,
        data: productos
      };

    } catch (error) {
      return {
        message: 'Error al obtener los productos',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: []
      };
    }
  }

  public async searchProductsByName(name:string){

    const allProducts = await  this.producRepository.find();
    let filterProducts = [];

    for(let i = 0; i<allProducts.length;i++){
      if(allProducts[i].nombre_producto.includes(name)){
        filterProducts.push(allProducts[i]);
      }
    }

    return {
      message:"Exito",
      status:HttpStatus.OK,
      data:filterProducts
    }
  }

}