import { Column, Entity, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
import {Carrito} from "./carrito.entity";
import { Product } from 'src/products/entities/product.entity';

@Entity('detalles_carrito')
export class DetallesCarrito{

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    cantidad:number

    @ManyToOne(()=> Carrito, carrito => carrito.detallesCarrito)
    carrito:Carrito

    @ManyToOne(()=>Product, product => product.dellatesCarrito)
    product:Product

}