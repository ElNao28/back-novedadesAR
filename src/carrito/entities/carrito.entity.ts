import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('carrito')
export class Carrito {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    nombre_producto:string;
    @Column()
    precio:number;
    @Column() 
    cantidad:number;
    @Column()
    img:string;

    @Column()
    usuarioId:number;
    @ManyToOne(() => User, user => user.carrito)
    usuario:string;
}
 