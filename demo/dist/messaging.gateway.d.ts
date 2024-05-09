import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { WebsocketServerTransport } from '@quarkid/agent';
export declare class MessagingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private transport;
    constructor(transport: WebsocketServerTransport);
    afterInit(server: any): void;
    handleConnection(client: any): void;
    handleDisconnect(client: any): void;
}
