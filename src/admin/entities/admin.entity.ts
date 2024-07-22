import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('administrador')
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    lastName: string;
    @Column()
    motherLastname: string;
    @Column()
    email: string;
    @Column()
    password: string;
}
