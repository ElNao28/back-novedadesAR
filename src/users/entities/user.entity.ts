import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    lastname:string;

    @Column()
    motherLastname:string;
    
    @Column()
    gender:string;

    @Column({ type: "date", nullable: true })
    birthdate: Date | null;

    @Column()
    city:string;

    @Column()
    address:string;

    @Column()
    cp:number;

    @Column({unique:true})
    email:string;

    @Column()
    cellphone:number;

    @Column()
    password:string;

    @Column()
    question:string;

    @Column()
    answer:string;
}
