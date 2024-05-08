import { Server } from 'socket.io';
import { TransportSendRequest } from './transport';
import { WebsocketTransport } from './websocket-transport';
export declare class WebsocketServerTransport extends WebsocketTransport {
    initializeServer(socketServer: Server): void;
    send(params: TransportSendRequest): void;
}
