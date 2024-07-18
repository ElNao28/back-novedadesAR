import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { DetallesCarrito } from './entities/detallesCarrito.entity';
import { Product } from 'src/products/entities/product.entity';


@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito) private carritoRepository:Repository<Carrito>,
    @InjectRepository(User) private userRepository:Repository<User>,
    @InjectRepository(Product)private productRepository:Repository<Product>,
    @InjectRepository(DetallesCarrito)private detallesCarrito:Repository<DetallesCarrito>,
    ) {}

  async addProductToCard(createCarrito:{idProduct:number,idUser:number,cantidad:number}){
    console.log(createCarrito);
    let idCardTrue = 0;
    const cards = await this.carritoRepository.find({
      relations:['usuario']
    });

    for(let i = 0; i < cards.length;i++){
      if(cards[i].estado === 'activo' && cards[i].usuario.id === createCarrito.idUser){
        idCardTrue = cards[i].id;
      }
    }
    const cardFoubd = await this.carritoRepository.findOne({
      where:{
        id:idCardTrue
      },
      relations:['detallesCarrito']
    })
    const foundProduct = await this.productRepository.findOne({
      where:{
        id:createCarrito.idProduct
      }
    });
    if(await this.detallesCarrito.findOne({
      where:{
        product:foundProduct,
        carrito:cardFoubd
      }
    })){
      return{
        message:"Producto ya agregado",
        status:HttpStatus.CONFLICT
      };
    }
    const newDetailCard = this.detallesCarrito.create({
      cantidad:createCarrito.cantidad,
      product:foundProduct,
      carrito:cardFoubd
    });
    this.detallesCarrito.save(newDetailCard);

    return{
      message:"Exito",
      status:HttpStatus.OK
    };
  }

  async getCard(data:{id:number}){
    const foundUser = await this.userRepository.findOne({
      where:{
        id:data.id
      } 
    });
    const foundCard = await this.carritoRepository.find({
      where:{
        usuario:foundUser
      },
      relations:['detallesCarrito','detallesCarrito.product','detallesCarrito.product.imagen']
    });
    for(let i = 0; i < foundCard.length;i++){
      if(foundCard[i].estado === 'activo'){
        return foundCard[i]
      }
    }
  }
  async deleteProductByCard(data:{id:number}){
    this.detallesCarrito.delete({
      id:data.id,
    })
    return{
      message:"Exito",
      status:HttpStatus.OK
    };
  }

  async changeCantidad(data:{id:number,cantidad:number}){
    this.detallesCarrito.update(data.id,{
      cantidad:data.cantidad
    })

    return{
      message:"Exito",
      status:HttpStatus.OK
    };
  }

  async addProductToCardByAlexa(createCarrito:{nameProduct:string,idUser:number,cantidad:number}){
    let idCardTrue = 0;
    const cards = await this.carritoRepository.find({
      relations:['usuario']
    });

    for(let i = 0; i < cards.length;i++){
      if(cards[i].estado === 'activo' && cards[i].usuario.id === createCarrito.idUser){
        idCardTrue = cards[i].id;
      }
    }
    const cardFoubd = await this.carritoRepository.findOne({
      where:{
        id:idCardTrue
      },
      relations:['detallesCarrito']
    })
    const foundProduct = await this.productRepository.findOne({
      where:{
        nombre_producto:createCarrito.nameProduct
      }
    });
    if(!foundProduct)return{
      message:'No encontrado',
      status:HttpStatus.NOT_FOUND
    }
    if(await this.detallesCarrito.findOne({
      where:{
        product:foundProduct,
        carrito:cardFoubd
      }
    })){
      return{
        message:"Producto ya agregado",
        status:HttpStatus.CONFLICT
      };
    }
    const newDetailCard = this.detallesCarrito.create({
      cantidad:createCarrito.cantidad,
      product:foundProduct,
      carrito:cardFoubd
    });
    this.detallesCarrito.save(newDetailCard);

    return{
      message:"Exito",
      status:HttpStatus.OK
    };
  }















}
