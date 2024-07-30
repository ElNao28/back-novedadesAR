import { Controller, Get, Patch, Body } from '@nestjs/common';
import { AboutUsService } from './about-us.service';
import { MisionDto, VisionDto } from './dto/mision.dto';

@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Get('mision')
  getMision() {
    return this.aboutUsService.getMision();
  }
  @Get('vision')
  getVision() {
    return this.aboutUsService.getVision();
  }
  @Patch('update-mision')
  updateMision(@Body()data:MisionDto){
    return this.aboutUsService.updateMision(data.mision)
  }
  @Patch('update-vision')
  updateVision(@Body()data:VisionDto){
    return this.aboutUsService.updateVision(data.vision)
  }
}
