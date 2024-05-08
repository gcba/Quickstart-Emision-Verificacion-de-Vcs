import { PublishDIDResponse } from "../models/publish-did.response";
import { ModenaRegistryBase } from "./modena-registry.service";
import { PublishDIDRequest } from "../models/publish-did-request";
import { UpdateDIDRequest } from "../models/update-did-request";
export declare class ModenaDidPublishRequest extends PublishDIDRequest {
    modenaApiURL: string;
}
export declare class Did extends ModenaRegistryBase<ModenaDidPublishRequest> {
    publishDID(request: ModenaDidPublishRequest): Promise<PublishDIDResponse>;
    updateDID(params: UpdateDIDRequest): Promise<void>;
}
