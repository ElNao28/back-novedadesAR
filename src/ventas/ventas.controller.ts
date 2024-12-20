import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VentasService } from './ventas.service';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}


  @Get('check-venta/:id')
  checkVenta(@Param('id')id:string){
    return this.ventasService.checkVenta(+id);
  }
  @Get('get-comentarios/:id')
  getComentarios(@Param('id')idUser:string){
    return this.ventasService.getComentariosByid(+idUser)
  }

  @Get('dataset')
  getDataSet(){
    return this.ventasService.dataByDataSet();
  }
  @Get(':id')
  getVentas(@Param('id')idUser:string){
    return this.ventasService.getVentas(parseInt(idUser));
  }
  @Get('ventas-status/:estado')
  getAllVentasByStatus(@Param('estado') estado:string){
    return this.ventasService.getAllVentasByStatus(estado);
  }
  @Post('add-code-rastreo/:id')
  addCodeRastreo(@Param('id') id: string, @Body() codigoRastreo: {code:number}){
    return this.ventasService.addCodeRastreo(+id, codigoRastreo.code);
  }
  @Post('add-raking')
  addRaking(@Body()data:{idVenta:number,raking:number,opinion:string}){
    return this.ventasService.addRaking(data.idVenta,data.raking,data.opinion)
  }
  @Post('venta-complete')
  ventaComplete(@Body()data:{idEnvio:number,fecha:Date,idVenta:number}){
    return this.ventasService.ventaComplete(data);
  }
  @Post('canceled')
  canceledVenta(@Body()data:{id:number}){
    return this.ventasService.canceledVenta(data.id)
  }
}
