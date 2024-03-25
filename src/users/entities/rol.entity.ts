import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
@Entity('roles')
export class Rol{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({default:'user'})
    rol:string;

    @OneToMany(()=>User, user => user.rol)
    usuario:User;
}