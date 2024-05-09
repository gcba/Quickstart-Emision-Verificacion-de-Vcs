import { Agent } from "../agent";
import { DID } from "../models/did";
import { ITransport, MessageArrivedEventArg } from "../models/transports/transport";
export declare class AgentTransport {
    private cacheStorage;
    private readonly onMessageArrived;
    get messageArrived(): import("../utils/lite-event").ILiteEvent<{
        message: any;
        transport: ITransport;
        contextMessage: any;
    }>;
    private readonly onConnected;
    get connected(): import("../utils/lite-event").ILiteEvent<{
        did: DID;
    }>;
    private readonly onDisconnected;
    get disconnected(): import("../utils/lite-event").ILiteEvent<{
        did: DID;
    }>;
    transports: ITransport[];
    agent: Agent;
    constructor(params: {
        agent: Agent;
        transports?: ITransport[];
    });
    handleConnect(params?: {
        did: DID;
    }): Promise<void>;
    handleDisconnect(params?: {
        did: DID;
    }): Promise<void>;
    handleMessage(params: MessageArrivedEventArg, transport: ITransport): Promise<void>;
    addTransports(transport: ITransport): void;
    getTranportByMessageId(messageId: string): ITransport;
    sendMessage(params: {
        to: DID;
        from?: DID;
        message: any;
        preferredTransport?: ITransport;
        messageContext?: any;
    }): Promise<void>;
    private sendMessageUsingTransport;
}
