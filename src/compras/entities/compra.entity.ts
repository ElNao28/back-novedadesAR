import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('compras')
export class Compra{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre_producto:string;
    
    @Column()
    precio:number;
    
    @Column()
    cantidad:number;
    
    @Column()
    total:number;
    
    @Column({ type: "date", nullable: true })
    fecha:Date;
    
    @Column()
    estado_compra:string;

    @Column()
    usuarioId:number;

    @ManyToOne(() => User, user => user.compras)
    usuario:User
}  