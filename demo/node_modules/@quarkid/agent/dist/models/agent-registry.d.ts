import { IJWK, IKMS } from "@extrimian/kms-core";
import { Did, ModenaUniversalRegistry } from "@extrimian/did-registry";
import { Purpose, Service } from "@extrimian/did-core";
import { DID } from "./did";
import { DIDDocumentMetadata } from "@extrimian/modena-sdk";
export declare abstract class IAgentRegistry {
    protected kms: IKMS;
    initialize(params: {
        kms: IKMS;
    }): void;
    abstract createDID(createRequest: CreateDIDRequest): Promise<CreateDIDResponse>;
    abstract updateDIDDocument(updateRequest: UpdateDIDRequest): Promise<void>;
}
export declare abstract class IAgentSidetreeRegistry extends IAgentRegistry {
    protected kms: IKMS;
    initialize(params: {
        kms: IKMS;
    }): void;
    abstract createDID(createRequest: CreateDIDRequest): Promise<CreateDIDSidetreeResponse>;
}
export interface CreateDIDRequest {
    didMethod?: string;
    updateKeys: IJWK[];
    recoveryKeys: IJWK[];
    verificationMethods: {
        id: string;
        type: string;
        publicKeyJwk: IJWK;
        purpose: Purpose[];
    }[];
    services?: Service[];
}
export interface UpdateDIDRequest {
    did: DID;
    updatePublicKey: IJWK;
    kms: IKMS;
    newUpdateKeys: IJWK[];
    documentMetadata: DIDDocumentMetadata;
    updateKeysToRemove?: {
        publicKeys?: IJWK[];
        updateCommitment?: string[];
    };
    verificationMethodsToAdd?: {
        id: string;
        type: string;
        publicKeyJwk: IJWK;
        purpose: Purpose[];
    }[];
    idsOfVerificationMethodsToRemove?: string[];
    servicesToAdd?: ServiceDefinition[];
    idsOfServiceToRemove?: string[];
}
export interface CreateDIDResponse {
    did: string;
}
export interface CreateDIDSidetreeResponse extends CreateDIDResponse {
    longDid: string;
}
export interface KeyDefinition {
    id: string;
    vmKey: VMKey;
}
export declare enum VMKey {
    ES256k = 0,
    DIDComm = 1,
    VC = 2,
    RSA = 3
}
export interface ServiceDefinition {
    id: string;
    type: string;
    serviceEndpoint: string | string[] | Record<string, string | string[]>;
}
export declare class AgentModenaUniversalRegistry extends IAgentSidetreeRegistry {
    private modenaEndpointURL;
    _defaultDidMethod: string;
    didService: ModenaUniversalRegistry;
    constructor(modenaEndpointURL: string, defaultDidMethod?: string);
    setDefaultDIDMethod(didMethod: string): void;
    getSupportedDidMethods(): Promise<string[]>;
    createDID(createRequest: CreateDIDRequest): Promise<CreateDIDSidetreeResponse>;
    updateDIDDocument(request: UpdateDIDRequest): Promise<void>;
}
export declare class AgentModenaRegistry extends IAgentSidetreeRegistry {
    private modenaEndpointURL;
    private didMethod?;
    didService: Did;
    constructor(modenaEndpointURL: string, didMethod?: string);
    createDID(createRequest: CreateDIDRequest): Promise<CreateDIDSidetreeResponse>;
    updateDIDDocument(request: UpdateDIDRequest): Promise<void>;
}
