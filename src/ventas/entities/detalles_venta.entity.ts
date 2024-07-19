import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn,OneToOne, JoinColumn } from "typeorm";
import { Venta } from "./venta.entity";
import { Comentarios } from "src/products/entities/comentatios.entity";

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
    
    @Column({nullable:true})
    calificacion:number;

    @OneToOne(()=>Comentarios)
    @JoinColumn()
    comentario:Comentarios;
    

    @ManyToOne(()=> Venta, venta => venta.detallesVenta)
    venta:Venta;
    
    @ManyToOne(()=> Product, product => product.detalleVenta)
    producto:Product;
} 