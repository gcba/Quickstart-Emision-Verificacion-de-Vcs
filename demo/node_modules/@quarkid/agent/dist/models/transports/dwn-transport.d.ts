import { DIDDocument } from '@extrimian/did-core';
import { DWNClient, MessageStorage } from '@extrimian/dwn-client';
import { Agent } from '../../agent';
import { ILiteEvent } from '../../utils/lite-event';
import { DID } from '../did';
import { IMessagingTransport } from './messaging-transport';
import { MessageArrivedEventArg, TransportSendRequest } from './transport';
export declare class DWNTransport implements IMessagingTransport {
    private readonly onMessageArrived;
    get messageArrived(): ILiteEvent<MessageArrivedEventArg>;
    dwnClientMap: Map<string, DWNClient>;
    agent: Agent;
    private resolver;
    dwnPollMilliseconds: number;
    constructor(params?: {
        dwnPollMilliseconds: number;
    });
    transportSupportedByTarget(params: {
        targetDID: DID;
    }): Promise<boolean>;
    dispose(): Promise<void>;
    processNewDID(did: DID, initialzing?: boolean): Promise<void>;
    initialize(params: {
        agent: Agent;
    }): Promise<void>;
    send(params: TransportSendRequest): Promise<void>;
    startPollSpecificClient(did: string, dwnClient: DWNClient): Promise<void>;
    getServiceUrl(didDocument: DIDDocument, serviceType: string, serviceEndpointMapKey?: string): string[];
}
export declare const inMemoryMessageStorage: MessageStorage;
