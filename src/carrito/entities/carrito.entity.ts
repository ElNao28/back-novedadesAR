import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DetallesCarrito } from "./detallesCarrito.entity";
@Entity('carrito')
export class Carrito {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    cantidad:number;    

    @OneToMany(()=>DetallesCarrito, detallesCarrito => detallesCarrito.carrito)
    detallesCarrito:DetallesCarrito[]
}