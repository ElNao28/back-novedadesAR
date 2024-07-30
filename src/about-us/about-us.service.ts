import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AboutUs } from './entities/about-us.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AboutUsService {
    constructor(@InjectRepository(AboutUs)private aboutRepository:Repository<AboutUs>){}
    async getVision(){
        const fountVison = await this.aboutRepository.findOneBy({id:1});
        return {
            message:'Exito',
            status:HttpStatus.OK,
            data:{
                vision:fountVison.vision
            }
        }
    }
    async getMision(){
        const fountMision = await this.aboutRepository.findOneBy({id:1});
        return {
            message:'Exito',
            status:HttpStatus.OK,
            data:{
                mision:fountMision.mision
            }
        }
    }
    async updateMision(mision:string){
        await this.aboutRepository.update(1,{
            mision
        });
        return{
            message:'exito',
            status:HttpStatus.OK
        }
    }
    async updateVision(vision:string){
        await this.aboutRepository.update(1,{
            vision
        });
        return{
            message:'exito',
            status:HttpStatus.OK
        }
    }
}