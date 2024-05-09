"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentModenaRegistry = exports.AgentModenaUniversalRegistry = exports.VMKey = exports.IAgentSidetreeRegistry = exports.IAgentRegistry = void 0;
const kms_core_1 = require("@extrimian/kms-core");
const did_registry_1 = require("@extrimian/did-registry");
const modena_sdk_1 = require("@extrimian/modena-sdk");
class IAgentRegistry {
    initialize(params) {
        this.kms = params.kms;
    }
}
exports.IAgentRegistry = IAgentRegistry;
class IAgentSidetreeRegistry extends IAgentRegistry {
    initialize(params) {
        this.kms = params.kms;
    }
}
exports.IAgentSidetreeRegistry = IAgentSidetreeRegistry;
var VMKey;
(function (VMKey) {
    VMKey[VMKey["ES256k"] = 0] = "ES256k";
    VMKey[VMKey["DIDComm"] = 1] = "DIDComm";
    VMKey[VMKey["VC"] = 2] = "VC";
    VMKey[VMKey["RSA"] = 3] = "RSA";
})(VMKey = exports.VMKey || (exports.VMKey = {}));
class AgentModenaUniversalRegistry extends IAgentSidetreeRegistry {
    constructor(modenaEndpointURL, defaultDidMethod) {
        super();
        this.modenaEndpointURL = modenaEndpointURL;
        this.didService = new did_registry_1.ModenaUniversalRegistry();
        modena_sdk_1.ModenaSdkConfig.maxCanonicalizedDeltaSizeInBytes = 2000;
        this._defaultDidMethod = defaultDidMethod;
    }
    setDefaultDIDMethod(didMethod) {
        this._defaultDidMethod = didMethod;
    }
    getSupportedDidMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.didService.getSupportedDidMethods(this.modenaEndpointURL);
        });
    }
    createDID(createRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const defaultDidMethod = createRequest.didMethod || this._defaultDidMethod || (yield (this.getSupportedDidMethods())[0]);
            const didService = new did_registry_1.ModenaUniversalRegistry();
            const createDIDResponse = yield didService.createDID({
                updateKeys: createRequest.updateKeys,
                recoveryKeys: createRequest.recoveryKeys,
                verificationMethods: createRequest.verificationMethods,
                services: ((_a = createRequest.services) === null || _a === void 0 ? void 0 : _a.length) > 0 ? createRequest.services : undefined,
            });
            const publishResult = yield didService.publishDID({
                didMethod: defaultDidMethod,
                universalResolverURL: this.modenaEndpointURL,
                createDIDResponse: createDIDResponse,
            });
            return {
                did: publishResult.did,
                longDid: publishResult.longDid,
            };
        });
    }
    updateDIDDocument(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.didService.updateDID({
                didSuffix: request.did.getDIDSuffix(),
                newUpdateKeys: request.newUpdateKeys,
                updateApiUrl: this.modenaEndpointURL,
                updateKeysToRemove: request.updateKeysToRemove,
                documentMetadata: request.documentMetadata,
                updatePublicKey: request.updatePublicKey,
                idsOfServiceToRemove: request.idsOfServiceToRemove,
                servicesToAdd: request.servicesToAdd,
                verificationMethodsToAdd: request.verificationMethodsToAdd,
                idsOfVerificationMethodsToRemove: request.idsOfVerificationMethodsToRemove,
                signer: (content) => __awaiter(this, void 0, void 0, function* () {
                    return yield request.kms.sign(kms_core_1.Suite.ES256k, request.updatePublicKey, content);
                }),
            });
        });
    }
}
exports.AgentModenaUniversalRegistry = AgentModenaUniversalRegistry;
class AgentModenaRegistry extends IAgentSidetreeRegistry {
    constructor(modenaEndpointURL, didMethod) {
        super();
        this.modenaEndpointURL = modenaEndpointURL;
        this.didMethod = didMethod;
        this.didService = new did_registry_1.Did();
    }
    createDID(createRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            modena_sdk_1.ModenaSdkConfig.maxCanonicalizedDeltaSizeInBytes = 2000;
            const createDIDResponse = yield this.didService.createDID({
                updateKeys: createRequest.updateKeys,
                recoveryKeys: createRequest.recoveryKeys,
                verificationMethods: createRequest.verificationMethods,
                didMethod: this.didMethod,
                services: ((_a = createRequest.services) === null || _a === void 0 ? void 0 : _a.length) > 0 ? createRequest.services : undefined,
            });
            const publishResult = yield this.didService.publishDID({
                modenaApiURL: this.modenaEndpointURL,
                createDIDResponse: createDIDResponse,
            });
            return {
                did: publishResult.did,
                longDid: createDIDResponse.longDid,
            };
        });
    }
    updateDIDDocument(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.didService.updateDID({
                didSuffix: request.did.getDIDSuffix(),
                newUpdateKeys: request.newUpdateKeys,
                updateApiUrl: this.modenaEndpointURL,
                updateKeysToRemove: request.updateKeysToRemove,
                documentMetadata: request.documentMetadata,
                updatePublicKey: request.updatePublicKey,
                idsOfServiceToRemove: request.idsOfServiceToRemove,
                servicesToAdd: request.servicesToAdd,
                verificationMethodsToAdd: request.verificationMethodsToAdd,
                idsOfVerificationMethodsToRemove: request.idsOfVerificationMethodsToRemove,
                signer: (content) => __awaiter(this, void 0, void 0, function* () {
                    return yield request.kms.sign(kms_core_1.Suite.ES256k, request.updatePublicKey, content);
                }),
            });
        });
    }
}
exports.AgentModenaRegistry = AgentModenaRegistry;
//# sourceMappingURL=agent-registry.js.map