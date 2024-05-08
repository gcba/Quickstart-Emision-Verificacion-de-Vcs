import { IJWK, KMSStorage } from "@extrimian/kms-core";
import { Service } from '@extrimian/did-core';
import { CreateDIDResponse } from "../models/create-did.response";
import { PublishDIDResponse } from "../models/publish-did.response";
import { IPublicKeys, ProcessResult, VerificationMethod } from "../models/interfaces";
import { PublishDIDRequest } from "../models/publish-did-request";
import { UpdateDIDRequest } from "../models/update-did-request";
export declare abstract class ModenaRegistryBase<TPublishRequest extends PublishDIDRequest> {
    create(createApiUrl: string, initialPublicKeys: IPublicKeys, storage: KMSStorage, services?: Service[], mobile?: boolean): Promise<ProcessResult>;
    createDID(params: {
        updateKeys: IJWK[];
        recoveryKeys: IJWK[];
        verificationMethods: VerificationMethod[];
        services?: Service[];
        didMethod?: string;
    }): Promise<CreateDIDResponse>;
    abstract updateDID(params: UpdateDIDRequest): any;
    publish(did: string): Promise<string>;
    abstract publishDID(request: TPublishRequest): Promise<PublishDIDResponse>;
}
