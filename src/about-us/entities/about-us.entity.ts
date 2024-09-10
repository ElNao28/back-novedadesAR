import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('about_us')
export class AboutUs{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type:'text'})
    vision: string;
    @Column({type:'text'})
    mision: string;
}