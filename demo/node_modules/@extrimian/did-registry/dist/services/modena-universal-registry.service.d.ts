import { PublishDIDRequest } from "../models/publish-did-request";
import { PublishDIDResponse } from "../models/publish-did.response";
import { UpdateDIDRequest } from "../models/update-did-request";
import { ModenaRegistryBase } from "./modena-registry.service";
export declare class ModenaUniversalPublishRequest extends PublishDIDRequest {
    didMethod: string;
    universalResolverURL: string;
}
export declare class ModenaUniversalRegistry extends ModenaRegistryBase<ModenaUniversalPublishRequest> {
    getSupportedDidMethods(universalRegistryUrl: string): Promise<string[]>;
    publishDID(request: ModenaUniversalPublishRequest): Promise<PublishDIDResponse>;
    updateDID(params: UpdateDIDRequest): Promise<void>;
}
