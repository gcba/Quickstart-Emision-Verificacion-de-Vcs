import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { WebsocketServerTransport } from '@quarkid/agent';

@WebSocketGateway({ cors: true })
export class MessagingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private transport: WebsocketServerTransport) {
    console.log("MessagingGateway")
  }

  afterInit(server): void {
    this.transport.initializeServer(server);
    Logger.log('Websocket server initialized', this.constructor.name);
  }

  handleConnection(client: any): void {
    Logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any): void {
    Logger.log(`Client disconnected: ${client.id}`);
  }
}