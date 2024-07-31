import { Injectable } from '@nestjs/common';
import { CreateTestMsjDto } from './dto/create-test-msj.dto';
import { UpdateTestMsjDto } from './dto/update-test-msj.dto';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';
import { TestMsj } from './entities/test-msj.entity';
import { JwtService } from '@nestjs/jwt';


interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: number,
        rol: string
    }
}


@Injectable()
export class TestMsjService {
    private connectedClients: ConnectedClients = {}
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Venta) private ventaRepository: Repository<Venta>,
        @InjectRepository(TestMsj) private testRepository: Repository<TestMsj>,
        private jwtService: JwtService
    ) { }

    async registerClient(client: Socket, token: string) {
        const tokenIs = this.jwtService.decode(token)
        if (tokenIs.rol === 'admin') {
            this.connectedClients[client.id] = {
                socket: client,
                rol: tokenIs.rol,
                user: 1
            };
        }
        else {
            const user = await this.userRepository.findOne({
                where: {
                    id: tokenIs.sub
                }
            });
            if (!user) throw new Error('User not found');

            this.checkUserConnection(user);

            this.connectedClients[client.id] = {
                socket: client,
                user: user.id,
                rol: tokenIs.rol
            };
        }

    }
    private checkUserConnection(user: User) {

        for (const clientId of Object.keys(this.connectedClients)) {

            const connectedClient = this.connectedClients[clientId];

            if (connectedClient.user === user.id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }
    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    async sendMessage(idVenta: number, message: string, by: string, client: Socket) {
        const foundVenta = await this.ventaRepository.findOne({
            where: {
                id: idVenta
            },
            relations: ['usuario', 'chat', 'chat.mensajes','admin']
        });
        if (!foundVenta) throw new Error('Venta not found');

        const newMessage = await this.testRepository.create({
            mensaje: message,
            chat: foundVenta.chat,
            by
        }) 
        await this.testRepository.save(newMessage);

        const messages = await this.testRepository.find({
            where: {
                chat: foundVenta.chat
            }
        })
        return {
            idVenta: foundVenta.id,
            mensajes: messages
        }
        // for (const clientId of Object.keys(this.connectedClients)) {
        //     const connectedClient = this.connectedClients[clientId];
        //     if(connectedClient.rol === 'user' && connectedClient.user === foundVenta.usuario.id){
        //         connectedClient.socket.emit('chat', { messages: messages });
        //     }
        //     if (connectedClient.rol === 'admin' && connectedClient.user === foundVenta.admin.id){
        //         connectedClient.socket.emit('chat', { messages: messages });
        //     }
        // }
    }

    async checkMessages(idVenta: number) {
        const foundVenta = await this.ventaRepository.findOne({
            where: {
                id: idVenta
            },
            relations: ['usuario', 'chat', 'chat.mensajes']
        });
        if (!foundVenta) throw new Error('Venta not found');

        console.log(foundVenta.id)
        const messages = await this.testRepository.find({
            where: {
                chat: foundVenta.chat
            }
        });
        return{
            idVenta: foundVenta.id,
            mensajes: messages
        }
        // for (const clientId of Object.keys(this.connectedClients)) {
        //     const connectedClient = this.connectedClients[clientId];
        //     if (connectedClient.user === foundVenta.usuario.id)
        //         connectedClient.socket.emit('chat', { messages: messages });
        // }
    }
}
