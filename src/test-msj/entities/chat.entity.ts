import { TestMsj } from "src/test-msj/entities/test-msj.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity('chat')
export class Chat{
    @PrimaryGeneratedColumn()
    id:number;


    @OneToMany(()=>TestMsj, msj => msj.chat)
    mensajes:TestMsj[];
}