import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('intentos')
export class Intentos {
    @PrimaryGeneratedColumn()
    id:number;
    @Column({nullable:true})
    intentos:number;
} 