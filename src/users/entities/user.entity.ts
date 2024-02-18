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

    @Column({unique:true, length:10})
    cellphone:string;

    @Column()
    password:string;

    @Column({nullable:true})
    intentos?:number | null;
}