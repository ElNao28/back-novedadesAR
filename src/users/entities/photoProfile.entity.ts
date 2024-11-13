import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('photo-profile')
export class PhotoProfile{

    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    url: string;
}