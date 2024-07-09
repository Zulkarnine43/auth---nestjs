import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway()
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: { data: string }, @ConnectedSocket() client: Socket): void {
        console.log('Message received:', message.data);
        this.server.emit('message', { data: message.data });
    }
}