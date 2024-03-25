import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('logs')
export class Logs{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    accion:string;
    @Column({type:'date'})
    fecha: Date;

    @ManyToOne(()=>User, user => user.logs)
    usuario:User;
}