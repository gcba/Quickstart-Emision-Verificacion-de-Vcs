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
exports.VerifiyJWSResult = exports.AgentKMS = void 0;
const did_core_1 = require("@extrimian/did-core");
const kms_core_1 = require("@extrimian/kms-core");
const did_1 = require("./did");
class AgentKMS {
    constructor(opts) {
        this.kms = opts.kms;
        this.resolver = opts.resolver;
        this.identity = opts.identity;
    }
    signMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const did = this.identity.getOperationalDID();
            const didDoc = yield this.resolver.resolve(did);
            const vms = did_core_1.DIDDocumentUtils.getVerificationMethodsByType(didDoc, did_core_1.VerificationMethodTypes.EcdsaSecp256k1VerificationKey2019);
            let vm = null;
            if (!params.publicKey) {
                params.publicKey = (yield this.kms.getAllPublicKeys()).find(x => vms.some(y => x.x == y.publicKeyJwk.x &&
                    x.y == y.publicKeyJwk.y));
            }
            if (!params.publicKey) {
                throw new Error(`Cannot find a valid key of type 'Ed25519VerificationKey2018' to use to signJWS for did ${did}`);
            }
            vm = vms.find(y => y.publicKeyJwk.x == params.publicKey.x &&
                y.publicKeyJwk.y == params.publicKey.y);
            if (!vm) {
                throw new Error(`Provided publicKey not found in did document: DID -> ${did} | pbk: ${JSON.stringify(params.publicKey)}`);
            }
            const result = yield this.kms.sign(kms_core_1.Suite.ES256k, params.publicKey, params.content);
            return {
                signature: result,
                publicKey: params.publicKey,
                verificationMethodId: vm.id.indexOf(did.value) > -1 ? vm.id : did.value + vm.id
            };
        });
    }
    verifyMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pbk = null;
                if ('verificationMethodId' in params) {
                    const did = did_1.DID.from(params.verificationMethodId);
                    const didDoc = yield this.resolver.resolve(did);
                    const vm = did_core_1.DIDDocumentUtils.getVerificationMethodById(didDoc, params.verificationMethodId);
                    if (!vm)
                        throw new Error(`Verification Method id not found in DID Document: ${params.verificationMethodId}`);
                    pbk = vm.publicKeyJwk;
                }
                if ('publicKey' in params) {
                    pbk = params.publicKey;
                }
                const result = yield this.kms.verifySignature(pbk, params.content, params.signature);
                if (result) {
                    return { verified: true };
                }
                ;
                return {
                    verified: false,
                    signedContent: null,
                    result: VerifiyJWSResult.InvalidSignature
                };
            }
            catch (ex) {
                return {
                    verified: false,
                    signedContent: null,
                    result: VerifiyJWSResult.UnexpectedError,
                    error: ex,
                };
            }
        });
    }
}
exports.AgentKMS = AgentKMS;
var VerifiyJWSResult;
(function (VerifiyJWSResult) {
    VerifiyJWSResult["InvalidContent"] = "invalid-content";
    VerifiyJWSResult["UnexpectedError"] = "invalid-content";
    VerifiyJWSResult["InvalidSignature"] = "invalid-signature";
})(VerifiyJWSResult = exports.VerifiyJWSResult || (exports.VerifiyJWSResult = {}));
//# sourceMappingURL=agent-kms.js.map