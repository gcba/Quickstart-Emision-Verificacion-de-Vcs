import { CreateDIDResponse } from "./create-did.response";
export declare class PublishDIDRequest {
    createDIDResponse: CreateDIDResponse;
    apiKey?: {
        fieldName?: string;
        value: string;
        type?: "header" | "queryParam";
    };
}
