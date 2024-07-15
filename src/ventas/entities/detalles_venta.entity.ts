import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Venta } from "./venta.entity";

@Entity('detalles_ventas')
export class DetallesVenta {
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    cantidad:number;

    @Column()
    descuento:number;

    @Column()
    precio:number;
        
    @ManyToOne(()=> Venta, venta => venta.detallesVenta)
    venta:Venta;
    
    @ManyToOne(()=> Product, product => product.detalleVenta)
    producto:Product;
} 