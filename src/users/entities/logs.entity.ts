import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('logs')
export class Logs{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({nullable:true})
    accion:string;
    @Column({nullable:true})
    ip:string;
    @Column({nullable:true})
    url_solicitada:string;
    @Column({nullable:true})
    status:number;
    @Column({nullable:true})
    fecha: string;

    @ManyToOne(()=>User, user => user.logs)
    usuario:User;
}