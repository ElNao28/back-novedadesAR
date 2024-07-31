import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from "typeorm";
import { Venta } from "src/ventas/entities/venta.entity";
@Entity('administrador')
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({nullable:true})
    nombre: string;
    @Column({nullable:true})
    lastName: string;
    @Column({nullable:true})
    motherLastname: string;
    @Column({nullable:true})
    email: string;
    @Column({nullable:true})
    password: string;

    @OneToMany(()=> Venta, chat => chat.admin)
    chat:Venta[]
}
 