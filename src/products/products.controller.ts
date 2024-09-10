import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResDto } from './dto/res.dto';
import { dataPayment } from './interfaces/dataPayment.interface';
import { UpdateProductDto } from './dto/update-product.dto';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51Os6QyP0xF5rSbalHiltPXqBNbewYYo0T3P02CikwxwUFGLXZqnfNoHZyC8P03TWCTUxypvbrTQqigaWoWx5ctlf00XocCc2bt');
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  @Get('products-by-type/:id')
  getProductByTypeUser(@Param('id')type:string){
    console.log('idCliente: '+type)
    return this.productsService.getProductByTypeUser(+type)
  }
  @Get('page/:id')
  getProductsByPage(@Param('id')id:string){
    return this.productsService.findProductsByPage(+id)
  }
  @Get('get-promociones')
  getProductsByDescuento() {
    return this.productsService.getProductsByDescuento();
  }
  @Get('prueba-android')
  prueba() {
    return {
      envios: [
        {
          id: 1,
          producto: "prueba",
          estado_envio: "En transito"
        },
        {
          id: 2,
          producto: "prueba 2",
          estado_envio: "Salio de platon"
        },
        {
          id: 3,
          producto: "prueba 4",
          estado_envio: "En destino"
        },
        {
          id: 4,
          producto: "prueba 5",
          estado_envio: "LLego al destino"
        }
      ]
    }
  }
  @Get('all-products-admin')
  getAllProducts() {
    return this.productsService.findAllProducts()
  }
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'imagen', maxCount: 4 }])
  )
  @Post()
  uploadFile(@Body() data: CreateProductDto, @UploadedFiles() files: { imagen?: Express.Multer.File[] }) {
    return this.productsService.create(data, files)
  }

  @Post('pago')
  pagoProducts(@Body() res: ResDto[]) {
    return this.productsService.formPago(res);
  }
  @Get()
  findAll() {
    return this.productsService.findAll();
  }
  @Get('data-inicio')
  findNovedades() {
    return this.productsService.findNovedades();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
  @Get('one/:id')
  produtsOne(@Param('id') id: string) {
    return this.productsService.findOneProduct(+id);
  }

  @Post('res-pago/:id/card/:idcard')
  async resPago(@Body() data: dataPayment, @Param('id') idUser: string, @Param('idcard') idCard: string) {
    console.log(data)
    if (data && data.data && data.data.id) {
      const idPayment = data.data.id;
      return this.productsService.checkPayment(parseInt(idPayment), idUser, idCard);
    } else {
      console.log("error")
    }
  }
  @Get('category/:id')
  getProductsByCategory(@Param('id') type: string) {
    return this.productsService.getProductByCategory(type);
  }
  @Post('filter')
  getProductsByFilter(@Body() datos) {
    return this.productsService.getProductByFilter(datos)
  }
  @Get('gender/:gender/category/:tipo')
  getProductsByGender(@Param('gender') gender: string, @Param('tipo') tipo: string) {
    return this.productsService.getProductsByGender(gender, tipo)
  }
  @Patch('change-status')
  changeStatus(@Body() data: { id: string, action: boolean }) {
    return this.productsService.alterStatusProduct(+data.id, data.action)
  }
  @Patch('update-product/:id')
  updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.updateProduct(data, +id)
  }

  @Post('stripe-pago')
  async pruebaPago(@Body() data: ResDto[]) {
    return this.productsService.pagoStripe(data)
  }

  @Post('webhook')
  async preubaW(@Body() data) {
    this.productsService.savePago(data.data.object.id)
  }
  @Patch('update-descuento')
  updateDescuento(@Body()data:{descuento:number,id:number}){
    return this.productsService.updateDescuento(data.id,data.descuento);
  }
  @Patch('update-stock')
  updateStock(@Body()data:{id:number,stock:number}){
    console.log(data)
    return this.productsService.updateStock(data.id,data.stock);
  }
}