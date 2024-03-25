import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ubicacion')
export class Ubicacion{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    estado:string;
    @Column() 
    municipio:string;
    @Column()
    cp:number;
    @Column()
    colonia:string;
}