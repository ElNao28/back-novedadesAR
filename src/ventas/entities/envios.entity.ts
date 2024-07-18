import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('envios')
export class Envios{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    numero_guia:string;
    @Column({type:'date', nullable:true})
    fecha_salida:Date;
    @Column({type:'date', nullable:true})
    fecha_entrega:Date;
}