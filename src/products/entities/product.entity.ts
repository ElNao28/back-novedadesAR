import { Column, Entity,ManyToOne,OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetallesCarrito } from 'src/carrito/entities/detallesCarrito.entity'
import { DetallesVenta } from "src/ventas/entities/detalles_venta.entity";
import { Imagenes } from "./imagenes.entity";
import { Comentarios } from "./comentatios.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre_producto: string;
    @Column({type:'float'})
    precio: number;
    @Column()
    descripccion: string;
    @Column()
    stock: number;
    @Column()
    categoria: string;
    @Column()
    rating?: number | null;
    @Column()
    descuento: number;
    @Column({default:'activo'})
    status:string;
    @Column()
    tipo:string

    @OneToMany(()=>DetallesCarrito, detalleCarrito => detalleCarrito.product)
    dellatesCarrito:DetallesCarrito;

    @OneToMany(()=>DetallesVenta, detallesVenta => detallesVenta.producto)
    detalleVenta:DetallesVenta;

    @OneToMany(()=>Imagenes, imagenes => imagenes.producto)
    imagen:Imagenes[];

    @OneToMany(()=>Comentarios,comentarios => comentarios.producto)
    comentarios:Comentarios[];
}