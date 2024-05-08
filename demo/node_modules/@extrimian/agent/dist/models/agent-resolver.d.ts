import { DIDDocument } from "@extrimian/did-core";
import { DIDModenaResolver, DIDUniversalResolver, ModenaResponse } from "@extrimian/did-resolver";
import { DID } from "./did";
export interface IAgentResolver {
    resolve(did: DID): Promise<DIDDocument>;
    resolveWithMetdata(did: DID): Promise<ModenaResponse>;
}
export declare class AgentModenaUniversalResolver implements IAgentResolver {
    universalResolver: DIDUniversalResolver;
    constructor(resolverURL: string);
    resolve(did: DID): Promise<DIDDocument>;
    resolveWithMetdata(did: DID): Promise<ModenaResponse>;
}
export declare class AgentModenaResolver implements IAgentResolver {
    modenaResolver: DIDModenaResolver;
    constructor(resolverURL: string);
    resolve(did: DID): Promise<DIDDocument>;
    resolveWithMetdata(did: DID): Promise<ModenaResponse>;
}
