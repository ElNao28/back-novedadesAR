import { Controller, Get, Post, Body } from '@nestjs/common';
import { CarritoService } from './carrito.service';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}
  @Post()
  createCarrito(@Body()data:{idUser:number,idProduct:number,cantidad:number}){
    return this.carritoService.addProductToCard(data);
  }
  @Post('get_card')
  getCarrito(@Body()data:{id:number}){
    return this.carritoService.getCard(data);
  }
  @Post('delete_card')
  deleteProductCard(@Body()data:{id:number}){
    return this.carritoService.deleteProductByCard(data);
  }
  @Post('update_cantidad')
  changeCantidad(@Body()data:{id:number,cantidad:number}){
    return this.carritoService.changeCantidad(data);
  }
  @Post('add-alexa')
  addProductByAlexa(@Body()data:{nameProduct:string,idUser:number}){
    console.log(data);
    return this.carritoService.addProductToCardByAlexa({nameProduct:data.nameProduct,idUser:data.idUser,cantidad:1});
  }
}
