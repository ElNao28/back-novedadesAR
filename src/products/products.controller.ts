import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ResDto } from './dto/res.dto';
import { dataPayment } from './interfaces/dataPayment.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('prueba-android')
  prueba(){
    return {
      envios:[
        {
          id:1,
          producto:"prueba",
          estado_envio:"En transito"
        },
        {
          id:2,
          producto:"prueba 2",
          estado_envio:"Salio de platon"
        },
        {
          id:3,
          producto:"prueba 4",
          estado_envio:"En destino"
        },
        {
          id:4,
          producto:"prueba 5",
          estado_envio:"LLego al destino"
        }
      ]
    }
  }
  @Get('all-products-admin')
  getAllProducts(){
    return this.productsService.findAllProducts()
  }
  @UseInterceptors(
    FileFieldsInterceptor([{name:'imagen',maxCount:4}])
  )
  @Post()
  uploadFile(@Body()data:CreateProductDto,@UploadedFiles() files: { imagen?: Express.Multer.File[]}) {
    return this.productsService.create(data,files)
  }

  @Post('pago')
  pagoProducts(@Body() res: ResDto[]) {
    return this.productsService.formPago(res);
  }
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post('res-pago/:id/card/:idcard')
  async resPago(@Body() data: dataPayment, @Param('id') idUser: string,@Param('idcard')idCard:string) {
    if (data && data.data && data.data.id) {
      const idPayment = data.data.id;
      return this.productsService.checkPayment(parseInt(idPayment), idUser,idCard);
    } else {
      console.log("error")
    }
  }
  @Get('category/:id')
  getProductsByCategory(@Param('id')type:string){
    return this.productsService.getProductByCategory(type);
  }
  @Post('filter')
  getProductsByFilter(@Body()datos){
    console.log(datos)
    return this.productsService.getProductByFilter(datos)
  }
  @Get('gender/:gender/category/:tipo')
  getProductsByGender(@Param('gender')gender:string,@Param('tipo')tipo:string){
    return this.productsService.getProductsByGender(gender,tipo)
  }
}