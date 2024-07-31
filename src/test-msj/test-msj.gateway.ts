import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { TestMsjService } from './test-msj.service';
import { Server, Socket } from 'socket.io';

interface Message {
  idVenta: number;
  message: string;
  by: string;
}
@WebSocketGateway({ cors: true })
export class TestMsjGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  constructor(private readonly testMsjService: TestMsjService) { }
  handleConnection(client: Socket) {
    console.log('cliente register ', client.id)
    //this.testMsjService.registerClient(client, client.handshake.headers.token as string)
  }
  handleDisconnect(client: Socket) {
    console.log('desconectado ' + client.id)
    this.testMsjService.removeClient(client.id)
  }

  @SubscribeMessage('chat')
  async onMessageFromClient(client: Socket, payload: Message) {
    console.log('cliente mensaje ', payload.idVenta)
    const messages = await this.testMsjService.sendMessage(payload.idVenta, payload.message, payload.by, client);
    const mensajes = messages.mensajes
    this.wss.to(`room_${messages.idVenta}`).emit('message', { messages:mensajes});
  }
  @SubscribeMessage('joinChat')
  async onJoinChat(client: Socket, payload: { idVenta: number }) {
    const room = `room_${payload.idVenta}`;
    console.log('cliente join ', client.id);

    client.join(room);
    const menssages = await this.testMsjService.checkMessages(payload.idVenta);
    this.wss.to(room).emit('message', { messages:menssages.mensajes});
  }
}
