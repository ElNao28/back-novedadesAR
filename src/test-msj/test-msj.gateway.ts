import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { TestMsjService } from './test-msj.service';
import { CreateTestMsjDto } from './dto/create-test-msj.dto';
import { UpdateTestMsjDto } from './dto/update-test-msj.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors:true})
export class TestMsjGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() wss: Server;
  constructor(private readonly testMsjService: TestMsjService) {}
  handleConnection(client: Socket) {
    console.log(client)
  }
  handleDisconnect(client: Socket) {
    console.log(client)
  }

  @SubscribeMessage('chat-message')
  onMessageFromClient( client: Socket, payload: any ) {
    console.log("mensaje desde el cliente: ", payload)
    this.wss.emit('new-message', payload)
  }

}
