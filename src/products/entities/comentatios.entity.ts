import { Entity, PrimaryGeneratedColumn,Column, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { User } from "src/users/entities/user.entity";

@Entity('comentarios')
export class Comentarios{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    comentario:string;
    @Column({type:'date'})
    fecha:Date;

    @ManyToOne(()=>Product,product=>product.comentarios)
    producto:Product;

    @ManyToOne(()=>User,user=>user.comentarios)
    usuario:User;
}