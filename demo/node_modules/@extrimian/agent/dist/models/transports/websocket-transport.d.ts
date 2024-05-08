import { Socket as ServerSocket } from 'socket.io';
import { Socket as ClientSocket } from 'socket.io-client';
import { Agent } from '../../agent';
import { ILiteEvent, LiteEvent } from '../../utils/lite-event';
import { DID } from '../did';
import { ConnectableTransport } from './connectable-transport';
import { MessageArrivedEventArg, TransportSendRequest } from './transport';
type GenericSocket = ServerSocket | ClientSocket;
export declare abstract class WebsocketTransport extends ConnectableTransport {
    protected readonly wsDidDocumentId: string;
    protected agent: Agent;
    protected readonly onMessageArrived: LiteEvent<MessageArrivedEventArg>;
    protected readonly connectedSockets: Map<string, GenericSocket>;
    constructor(wsDidDocumentId?: string);
    get messageArrived(): ILiteEvent<MessageArrivedEventArg>;
    dispose(params?: {
        did: DID;
    }): Promise<void>;
    initialize(params: {
        agent: Agent;
    }): Promise<void>;
    abstract send(params: TransportSendRequest): Promise<void> | void;
    transportSupportedByTarget(params: {
        targetDID: DID;
    }): Promise<boolean>;
    listenToSocket(socket: GenericSocket, params?: {
        did: DID;
    }): void;
}
export {};
