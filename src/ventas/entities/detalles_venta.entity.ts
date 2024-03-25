import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Envios } from "./envios.entity";

@Entity('detalles_ventas')
export class DetallesVenta {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type: 'date'})
    fecha:Date;
    @Column()
    cantidad:number;
    @Column()
    total_venta:number;
    
    @ManyToOne(()=> Product, product => product.detalleVenta)
    producto:Product;

    @ManyToOne(()=> Envios, envios=>envios.detallesVenta)
    envio:Envios;
}