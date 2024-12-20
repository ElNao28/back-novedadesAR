import { Carrito } from "src/carrito/entities/carrito.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn,OneToOne,JoinColumn, ManyToOne } from "typeorm";
import { Intentos } from "./intentos.entity";
import { Logs } from "./logs.entity";
import { Question } from "./question.entity";
import { Ubicacion } from "./ubicacion.entity";
import { Rol } from "./rol.entity";
import { Venta } from "src/ventas/entities/venta.entity"
import { Comentarios } from "src/products/entities/comentatios.entity";
import { Rating } from '../../rating/entities/rating.entity';
import { PhotoProfile } from "./photoProfile.entity";
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
    @Column({unique:true})
    email:string;
    @Column({unique:true, length:10})
    cellphone:string;
    @Column()
    password:string;
    @Column()
    answer:string;
    @Column()
    codeAlexa:string;
    @Column({default:false})
    isRating:boolean;

    @ManyToOne(()=>Question, question => question.users)
    question:Question;

    @ManyToOne(()=>Rol, rol => rol.usuario)
    rol:Rol;

    @OneToOne(()=>Intentos)
    @JoinColumn()
    intentos:Intentos;

    @OneToOne(()=>PhotoProfile)
    @JoinColumn()
    photo:PhotoProfile;

    @OneToOne(()=>Ubicacion)
    @JoinColumn()
    ubicacion:Ubicacion;

    @OneToMany(()=>Logs, logs =>logs.usuario)
    logs:Logs[];

    @OneToMany(()=>Carrito, carrito =>carrito.usuario)
    carrito:Carrito[];

    @OneToMany(()=>Venta, venta =>venta.usuario)
    ventas:Venta[];

    @OneToMany(()=>Comentarios,comentarios => comentarios.usuario)
    comentarios:Comentarios[];

    @OneToMany(()=>Rating,rating => rating.usuario)
    calificaciones:Rating[];
}