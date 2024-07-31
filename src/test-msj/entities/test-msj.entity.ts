import { Column, Entity, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
import { Chat } from "src/test-msj/entities/chat.entity";

@Entity('mensajes')
export class TestMsj {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    mensaje: string;
    @Column()
    by:string;

    @ManyToOne(() => Chat, chat => chat.mensajes)
    chat:Chat
}
