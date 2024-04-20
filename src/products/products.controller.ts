import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResDto } from './dto/res.dto';
import { dataPayment } from './interfaces/dataPayment.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @UseInterceptors(FileInterceptor('imagen'))
  @Post()
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    console.log(createProductDto)
    //return this.productsService.create(createProductDto, file);
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
}