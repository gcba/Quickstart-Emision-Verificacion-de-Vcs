import { Agent } from '../../agent';
import { ILiteEvent, LiteEvent } from '../../utils/lite-event';
import { DID } from '../did';
import { ITransport, MessageArrivedEventArg } from './transport';
export declare abstract class ConnectableTransport implements ITransport {
    protected agent: Agent;
    protected readonly onMessageArrived: LiteEvent<MessageArrivedEventArg>;
    protected handleConnect(params?: {
        did: DID;
    }): void;
    protected handleDisconnect(params: {
        did: DID;
    }): void;
    initialize(params: {
        agent: Agent;
    }): Promise<void>;
    get messageArrived(): ILiteEvent<MessageArrivedEventArg>;
    abstract send(params: {
        data: any;
        context?: any;
    }): Promise<void> | void;
    protected handleMessage(params: MessageArrivedEventArg, transport: ITransport): Promise<void>;
    abstract transportSupportedByTarget(params: {}): Promise<boolean>;
    abstract dispose(): Promise<void>;
}
