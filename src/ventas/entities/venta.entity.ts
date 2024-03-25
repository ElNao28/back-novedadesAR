import { Entity, PrimaryGeneratedColumn,OneToOne , ManyToOne,OneToMany,JoinColumn } from "typeorm";
import { User } from "src/users/entities/user.entity"
import { DetallesVenta } from "./detalles_venta.entity"
@Entity('ventas')
export class Venta {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=>DetallesVenta)
    @JoinColumn()
    detallesVenta:DetallesVenta

    @ManyToOne(()=>User, user => user.ventas)
    usuario:User;
}