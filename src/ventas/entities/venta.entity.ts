import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, OneToMany, JoinColumn, Column } from "typeorm";
import { User } from "src/users/entities/user.entity"
import { DetallesVenta } from "./detalles_venta.entity"
import { Envios } from "./envios.entity";
import { Chat } from "src/test-msj/entities/chat.entity";
import { Admin } from "src/admin/entities/admin.entity";

@Entity('ventas')
export class Venta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total_venta: number;

    @Column({ type: 'date', nullable: true })
    fecha_venta: Date | null;

    @Column({ default: 'Fenvio' })
    estado: string;

    @Column({ nullable: true })
    idSession: string;

    @Column({ nullable: true })
    idCarrito: string;

    @OneToMany(() => DetallesVenta, detallesVenta => detallesVenta.venta)
    detallesVenta: DetallesVenta[];

    @ManyToOne(() => User, user => user.ventas)
    usuario: User;

    @OneToOne(() => Envios)
    @JoinColumn()
    envio: Envios;

    @OneToOne(() => Chat)
    @JoinColumn()
    chat: Chat;

    @ManyToOne(()=>Admin,admin => admin.chat)
    admin:Admin
} 