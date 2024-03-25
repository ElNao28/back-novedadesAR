import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('imagenes')
export class Imagenes {
    @PrimaryGeneratedColumn()
    id:string;
    @Column()
    url_imagen:string;

    @ManyToOne(()=>Product, product => product.imagen)
    producto: Product;
}