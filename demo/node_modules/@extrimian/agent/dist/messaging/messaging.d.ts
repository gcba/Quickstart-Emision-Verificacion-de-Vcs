import { DIDCommMessage } from "@extrimian/did-core";
import { DIDCommMessagePacking, DIDCommPackedMessage, IDIDCommMessage, IKMS } from "@extrimian/kms-core";
import { AgentIdentity } from "../models/agent-identity";
import { IAgentRegistry } from "../models/agent-registry";
import { IAgentResolver } from "../models/agent-resolver";
import { DID } from "../models/did";
import { AgentTransport } from "../transport/transport";
import { ITransport } from "../models/transports/transport";
export declare class Messaging {
    private kms;
    private resolver;
    private registry;
    private identity;
    private transport;
    constructor(args: {
        kms: IKMS;
        resolver: IAgentResolver;
        registry: IAgentRegistry;
        identity: AgentIdentity;
        transport: AgentTransport;
    });
    packMessage(params: {
        to: DID[] | DID;
        from?: DID;
        message: IDIDCommMessage;
        messageManagerCompatible?: boolean;
    }): Promise<{
        packedMessage: DIDCommPackedMessage;
    }>;
    unpackMessage(params: {
        message: DIDCommPackedMessage | string;
    }): Promise<DIDCommMessage>;
    sendMessage(params: {
        to: DID;
        from?: DID;
        message: any;
        packing?: DIDCommMessagePacking;
        preferredTransport?: ITransport;
    }): Promise<void>;
    private getFullVerificationMethodId;
}
