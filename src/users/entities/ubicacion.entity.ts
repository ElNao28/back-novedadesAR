import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ubicacion')
export class Ubicacion{
    @PrimaryGeneratedColumn()
    id: number
    @Column({nullable:true,default:''})
    estado:string;
    @Column({nullable:true,default:''}) 
    municipio:string;
    @Column({nullable:true,default:0})
    cp:number;
    @Column({nullable:true,default:''})
    colonia:string;
    @Column({nullable:true, default:''})
    referencia:string;
}