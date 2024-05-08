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
exports.Messaging = void 0;
const did_core_1 = require("@extrimian/did-core");
const kms_core_1 = require("@extrimian/kms-core");
const did_1 = require("../models/did");
class Messaging {
    constructor(args) {
        this.kms = args.kms;
        this.resolver = args.resolver;
        this.registry = args.registry;
        this.identity = args.identity;
        this.transport = args.transport;
    }
    packMessage(params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(params.to)) {
                params.to = [params.to];
            }
            const myDID = ((_a = params.from) === null || _a === void 0 ? void 0 : _a.value) || this.identity.getDIDs().find(x => params.message.from == x) || this.identity.getOperationalDID().value;
            if (!myDID) {
                throw new Error(`Message from ${(_b = params.message) === null || _b === void 0 ? void 0 : _b.from} is not a DID managed by this agent. Please check message.from`);
            }
            const myDIDDocument = yield this.resolver.resolve(did_1.DID.from(myDID));
            const myKeyAgreements = did_core_1.DIDDocumentUtils.getVerificationMethodsByType(myDIDDocument, did_core_1.VerificationMethodTypes.X25519KeyAgreementKey2019);
            const didCommV2Keys = yield this.kms.getPublicKeysBySuiteType(kms_core_1.Suite.DIDCommV2);
            const keyToSign = myKeyAgreements.find(x => didCommV2Keys.some(y => y.x == x.publicKeyJwk.x && y.y == x.publicKeyJwk.y));
            const receiptVerificationMethods = yield Promise.all(params.to.map((did) => __awaiter(this, void 0, void 0, function* () {
                const targetDIDDocument = yield this.resolver.resolve(did);
                const targetKeyAgreements = did_core_1.DIDDocumentUtils.getVerificationMethodsByType(targetDIDDocument, did_core_1.VerificationMethodTypes.X25519KeyAgreementKey2019);
                return targetKeyAgreements;
                // return `${this.getFullVerificationMethodId(targetKeyAgreements[0].id, did)}`;
            })));
            if (params.messageManagerCompatible) {
                const toPublickKeyHex = kms_core_1.BaseConverter.convert(receiptVerificationMethods[0][0].publicKeyJwk, kms_core_1.Base.JWK, kms_core_1.Base.Hex, receiptVerificationMethods[0][0].type);
                const message = yield this.kms.packv2(myKeyAgreements[0].publicKeyJwk, this.getFullVerificationMethodId(myKeyAgreements[0].id, this.identity.getOperationalDID()), [toPublickKeyHex], params.message, "authcrypt");
                return { packedMessage: JSON.parse(message.message) };
            }
            const result = yield this.kms.packDIDCommV2({
                senderVerificationMethodId: this.getFullVerificationMethodId(keyToSign.id, did_1.DID.from(myDID)),
                recipientVerificationMethodIds: receiptVerificationMethods.map(vm => `${this.getFullVerificationMethodId(vm[0].id, did_1.DID.from(vm[0].controller))}`),
                message: params.message,
                packing: "authcrypt"
            });
            return result;
        });
    }
    unpackMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof params.message === "string") {
                params.message = JSON.parse(params.message);
            }
            const myKid = params.message.recipients.find(x => this.identity.getDIDs().some(did => did == did_1.DID.from(x.header.kid).value));
            if (!myKid) {
                const didDocument = yield this.resolver.resolve(this.identity.getOperationalDID());
                const myKeyAgreements = did_core_1.DIDDocumentUtils.getVerificationMethodsByType(didDocument, did_core_1.VerificationMethodTypes.X25519KeyAgreementKey2019);
                const key = myKeyAgreements[0];
                const packedMessage = yield this.kms.unpackv2(key.publicKeyJwk, { message: params.message });
                return packedMessage.message;
                //TODO Arrojar excepción cuando se implemente el Backend Agent y sacar esto.
            }
            const unpackedMessage = yield this.kms.unpackvDIDCommV2(did_1.DID.from(myKid.header.kid).value, params.message);
            return unpackedMessage.message;
        });
    }
    sendMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.packing) {
                params.packing = "authcrypt";
            }
            if (params.packing != "none") {
                params.message = (yield this.packMessage({
                    to: params.to,
                    from: params.from,
                    message: params.message
                })).packedMessage;
            }
            yield this.transport.sendMessage({
                message: params.message,
                from: params.from,
                to: params.to,
                preferredTransport: params.preferredTransport
            });
        });
    }
    getFullVerificationMethodId(verificationMethodId, did) {
        if (verificationMethodId.indexOf(did.value) > -1) {
            return verificationMethodId;
        }
        return `${did.value}#${verificationMethodId.replace("#", "")}`;
    }
}
exports.Messaging = Messaging;
//# sourceMappingURL=messaging.js.map