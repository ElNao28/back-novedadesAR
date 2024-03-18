import { Carrito } from "src/carrito/entities/carrito.entity";
import { Compra } from "src/compras/entities/compra.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


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

    @OneToMany(()=>Compra, compra => compra.usuario)
    compras: Compra[];

    @OneToMany(()=>Carrito, carrito => carrito.usuario)
    carrito: Carrito[];
} 