import { User } from './user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('questions')
export class Question{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    question:string;

    @OneToMany(()=>User, user => user.question)
    users: User[];
}