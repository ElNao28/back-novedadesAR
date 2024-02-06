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
    estado:string;

    @Column()
    municipio:string;

    @Column()
    cp:number;

    @Column()
    colonia:string;

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
