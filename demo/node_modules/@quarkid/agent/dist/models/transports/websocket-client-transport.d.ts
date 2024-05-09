import { TransportSendRequest } from './transport';
import { WebsocketTransport } from './websocket-transport';
export declare class WebsocketClientTransport extends WebsocketTransport {
    send(params: TransportSendRequest): Promise<void>;
}
