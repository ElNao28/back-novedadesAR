import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('token_browser')
export class TokenNotificacion{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({type:'text'})
    token:string;
}