import { Entity, PrimaryGeneratedColumn,OneToOne , ManyToOne,OneToMany,JoinColumn, Column } from "typeorm";
import { User } from "src/users/entities/user.entity"
import { DetallesVenta } from "./detalles_venta.entity"
import { Envios } from "./envios.entity";
@Entity('ventas')
export class Venta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total_venta:number;

    @Column({type: 'date', nullable: true})
    fecha_venta:Date | null;

    @OneToMany(()=>DetallesVenta, detallesVenta => detallesVenta.venta )
    detallesVenta: DetallesVenta[];

    @ManyToOne(()=>User, user => user.ventas)
    usuario:User;

    @OneToOne(()=>Envios)
    @JoinColumn()
    envio:Envios
} 