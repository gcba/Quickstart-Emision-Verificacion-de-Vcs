import { IJWK, IKMS } from "@extrimian/kms-core";
import { AgentIdentity } from "./agent-identity";
import { IAgentResolver } from "./agent-resolver";
export declare class AgentKMS {
    private kms;
    private resolver;
    private identity;
    constructor(opts: {
        kms: IKMS;
        resolver: IAgentResolver;
        identity: AgentIdentity;
    });
    signMessage(params: {
        content: string;
        publicKey?: IJWK;
    }): Promise<{
        signature: string;
        publicKey: IJWK;
        verificationMethodId: string;
    }>;
    verifyMessage(params: {
        content: string;
        publicKey: IJWK;
        signature: string;
    } | {
        content: string;
        verificationMethodId: string;
        signature: string;
    }): Promise<{
        verified: true;
    } | {
        verified: false;
        result: VerifiyJWSResult;
        signedContent: string;
        error?: any;
    }>;
}
export declare enum VerifiyJWSResult {
    InvalidContent = "invalid-content",
    UnexpectedError = "invalid-content",
    InvalidSignature = "invalid-signature"
}
