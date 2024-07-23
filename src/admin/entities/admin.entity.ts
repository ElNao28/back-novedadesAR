import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
