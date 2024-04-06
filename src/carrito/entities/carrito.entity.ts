import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DetallesCarrito } from "./detallesCarrito.entity";
import { User } from 'src/users/entities/user.entity';
@Entity('carrito')
export class Carrito {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({default:'activo'})
    estado:string;

    @ManyToOne(()=>User, user => user.carrito)
    usuario:User;

    @OneToMany(()=>DetallesCarrito, detallesCarrito => detallesCarrito.carrito)
    detallesCarrito:DetallesCarrito[];
    
}
