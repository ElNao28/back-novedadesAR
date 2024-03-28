import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('envios')
export class Envios{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    numero_guia:number;
    @Column({type:'date'})
    fecha_salida:Date;
    @Column({type:'date'})
    fecha_entrega:Date;
}