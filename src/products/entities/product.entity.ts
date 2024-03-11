import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    rating: number;
    @Column()
    descuento: number;
}