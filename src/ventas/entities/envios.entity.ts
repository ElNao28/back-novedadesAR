import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetallesVenta } from "./detalles_venta.entity";

@Entity('envios')
export class Envios{
    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(()=>DetallesVenta, detallesVenta => detallesVenta.envio)
    detallesVenta:DetallesVenta;
}