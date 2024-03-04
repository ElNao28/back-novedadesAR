import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  create(@Body() createCompraDto: CreateCompraDto) {
    return this.comprasService.create(createCompraDto);
  }

  @Get()
  findAll() {
    return this.comprasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompraDto: UpdateCompraDto) {
    return this.comprasService.update(+id, updateCompraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comprasService.remove(+id);
  }
}
