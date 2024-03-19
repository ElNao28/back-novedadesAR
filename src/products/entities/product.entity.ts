import { Compra } from "src/compras/entities/compra.entity";
import { Column, Entity,OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetallesCarrito } from 'src/carrito/entities/detallesCarrito.entity'

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
    imagen: string;
    @Column()
    rating?: number | null;
    @Column()
    descuento: number;
    @Column({default:'activo'})
    status:string;

    @OneToMany(()=>DetallesCarrito, detalleCarrito => detalleCarrito.product)
    dellatesCarrito:DetallesCarrito
}