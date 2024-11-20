import { Entity,PrimaryGeneratedColumn,Column,ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
@Entity('rating')
export class Rating {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    expCompra:number
    @Column()
    detalles:number
    @Column()
    satOptimizacion:number
    @Column()
    fecha: string;

    @ManyToOne(()=>User, user => user.calificaciones)
    usuario:User;
}
