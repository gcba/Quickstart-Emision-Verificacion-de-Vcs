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
exports.AgentIdentity = void 0;
const did_core_1 = require("@extrimian/did-core");
const kms_core_1 = require("@extrimian/kms-core");
const lite_event_1 = require("../utils/lite-event");
const agent_registry_1 = require("./agent-registry");
const did_1 = require("./did");
const modena_sdk_1 = require("@extrimian/modena-sdk");
const AGENT_DID_KEY = 'agent-did';
const OPERATIONAL_DID_KEY = 'operational-did';
class AgentIdentity {
    get operationalDIDChanged() {
        return this._onOperationalDIDChanged.expose();
    }
    get identityInitialized() {
        return this._onIdentityInitialized.expose();
    }
    get didCreated() {
        return this.onDidCreated.expose();
    }
    constructor(params) {
        this._dids = new Array();
        this._onOperationalDIDChanged = new lite_event_1.LiteEvent();
        this._onIdentityInitialized = new lite_event_1.LiteEvent();
        this.onDidCreated = new lite_event_1.LiteEvent();
        this.agentStorage = params.agentStorage;
        this.kms = params.kms;
        this.resolver = params.resolver;
        this.registry = params.registry;
    }
    get initialized() {
        return this._initialized;
    }
    initialize(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.resolver = params.resolver;
            this.registry = params.registry;
            this._dids =
                (yield this.agentStorage.get(AGENT_DID_KEY)) || new Array();
            if (params.operationalDID) {
                if (this._dids.indexOf(params.operationalDID.value) == -1) {
                    throw new Error(`Operational DID ${params.operationalDID} not exists on agent. You must import the did with its private keys`);
                }
                yield this.setOperationalDID(params.operationalDID);
            }
            else {
                const did = (yield this.agentStorage.get(OPERATIONAL_DID_KEY));
                this._did = did != null ? did_1.DID.from(did) : null;
                if (!this._did && this._dids && this._dids.length > 0) {
                    yield this.setOperationalDID(did_1.DID.from(this._dids[0]));
                }
                else if (this._did) {
                    yield this.setOperationalDID(this._did);
                }
                if ((_a = this._did) === null || _a === void 0 ? void 0 : _a.isLongDID()) {
                    const shortDID = this.getDIDs().map(x => did_1.DID.from(x)).find(x => this._did.isLongDIDFor(x));
                    if (shortDID) {
                        const result = yield this.checkDIDPublished(shortDID, true);
                        if (!result) {
                            this.waitForDIDPublish(shortDID, true);
                        }
                    }
                }
            }
            this._initialized = true;
            this._onIdentityInitialized.trigger();
        });
    }
    addDID(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._did) {
                this._did = params.did;
            }
            if (!this._dids[params.did.value]) {
                this._dids.push(params.did.value);
                yield this.agentStorage.add(AGENT_DID_KEY, this._dids);
            }
        });
    }
    setOperationalDID(did) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!did) {
                throw new Error("Operational DID to set can't be null or undefined.");
            }
            if (this._dids.indexOf(did.value) == -1) {
                throw new Error('Operational DID to set must be defined on dids of the identity. You must import the did with its private keys');
            }
            const auxDid = this._did;
            this._did = did;
            yield this.agentStorage.add(OPERATIONAL_DID_KEY, this._did.value);
            if (auxDid != did) {
                this._onOperationalDIDChanged.trigger({ did });
            }
        });
    }
    getOperationalDID() {
        return this._did;
    }
    getDIDs() {
        return [...this._dids];
    }
    createNewDID(params) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            params = params || {};
            if (!params.keysToCreate || params.createDefaultKeys) {
                if (!params.keysToCreate) {
                    params.keysToCreate = new Array();
                }
                if (!params.preventCredentialCreation) {
                    params.keysToCreate.push({ id: 'vc-bbsbls', vmKey: agent_registry_1.VMKey.VC });
                }
                params.keysToCreate.push({ id: 'didcomm', vmKey: agent_registry_1.VMKey.DIDComm });
                params.keysToCreate.push({ id: 'rsa', vmKey: agent_registry_1.VMKey.RSA });
            }
            const updateKey = yield this.kms.create(kms_core_1.Suite.ES256k);
            const recoveryKey = yield this.kms.create(kms_core_1.Suite.ES256k);
            if (params.keysToImport) {
                for (let ktu of params.keysToImport) {
                    yield this.kms.import({
                        publicKeyHex: kms_core_1.BaseConverter.convert(ktu.publicKeyJWK, kms_core_1.Base.JWK, kms_core_1.Base.Hex, ktu.secrets.keyType),
                        secret: ktu.secrets,
                    });
                }
            }
            const didCommKeys = [...yield Promise.all(params.keysToCreate
                    .filter((x) => x.vmKey == agent_registry_1.VMKey.DIDComm)
                    .map((x) => __awaiter(this, void 0, void 0, function* () {
                    return ({
                        id: x.id,
                        pbk: yield this.kms.create(kms_core_1.Suite.DIDCommV2),
                    });
                }))), ...(_a = (params.keysToImport || [])) === null || _a === void 0 ? void 0 : _a.filter(x => x.vmKey == agent_registry_1.VMKey.DIDComm).map(x => ({
                    id: x.id,
                    pbk: { publicKeyJWK: x.publicKeyJWK }
                }))];
            const bbsbls2020Keys = [...yield Promise.all(params.keysToCreate
                    .filter((x) => x.vmKey == agent_registry_1.VMKey.VC)
                    .map((x) => __awaiter(this, void 0, void 0, function* () {
                    return ({
                        id: x.id,
                        pbk: yield this.kms.create(kms_core_1.Suite.Bbsbls2020),
                    });
                }))),
                ...(_b = (params.keysToImport || [])) === null || _b === void 0 ? void 0 : _b.filter(x => x.vmKey == agent_registry_1.VMKey.VC).map(x => ({
                    id: x.id,
                    pbk: { publicKeyJWK: x.publicKeyJWK }
                }))];
            const rsaKeys = [...yield Promise.all(params.keysToCreate
                    .filter((x) => x.vmKey == agent_registry_1.VMKey.RSA)
                    .map((x) => __awaiter(this, void 0, void 0, function* () {
                    return ({
                        id: x.id,
                        pbk: yield this.kms.create(kms_core_1.Suite.RsaSignature2018),
                    });
                }))),
                ...(_c = (params.keysToImport || [])) === null || _c === void 0 ? void 0 : _c.filter(x => x.vmKey == agent_registry_1.VMKey.RSA).map(x => ({
                    id: x.id,
                    pbk: { publicKeyJWK: x.publicKeyJWK }
                }))];
            const ecdskeys = [...yield Promise.all(params.keysToCreate
                    .filter((x) => x.vmKey == agent_registry_1.VMKey.ES256k)
                    .map((x) => __awaiter(this, void 0, void 0, function* () {
                    return ({
                        id: x.id,
                        pbk: yield this.kms.create(kms_core_1.Suite.ES256k),
                    });
                }))),
                ...(_d = (params.keysToImport || [])) === null || _d === void 0 ? void 0 : _d.filter(x => x.vmKey == agent_registry_1.VMKey.ES256k).map(x => ({
                    id: x.id,
                    pbk: { publicKeyJWK: x.publicKeyJWK }
                }))];
            if (!params.services) {
                params.services = new Array();
            }
            if (params.dwnUrl) {
                params.services.push({
                    id: 'dwn-default',
                    type: 'DecentralizedWebNode',
                    serviceEndpoint: {
                        nodes: typeof params.dwnUrl === 'string' ? [params.dwnUrl] : params.dwnUrl,
                    },
                });
            }
            const response = yield this.registry.createDID({
                didMethod: params.didMethod,
                recoveryKeys: [recoveryKey.publicKeyJWK],
                updateKeys: [updateKey.publicKeyJWK],
                services: params.services,
                verificationMethods: didCommKeys
                    .map((x) => ({
                    id: x.id,
                    publicKeyJwk: x.pbk.publicKeyJWK,
                    purpose: [new did_core_1.KeyAgreementPurpose()],
                    type: 'X25519KeyAgreementKey2019',
                    controller: this.getOperationalDID(),
                }))
                    .concat(bbsbls2020Keys
                    .map((x) => ({
                    id: x.id,
                    publicKeyJwk: x.pbk.publicKeyJWK,
                    purpose: [new did_core_1.AssertionMethodPurpose()],
                    type: 'Bls12381G1Key2020',
                    controller: this.getOperationalDID(),
                }))
                    .concat(rsaKeys.map((x) => ({
                    id: x.id,
                    publicKeyJwk: x.pbk.publicKeyJWK,
                    purpose: [new did_core_1.AuthenticationPurpose()],
                    type: 'RsaSignature2018',
                    controller: this.getOperationalDID(),
                })))
                    .concat(ecdskeys.map((x) => ({
                    id: x.id,
                    publicKeyJwk: x.pbk.publicKeyJWK,
                    purpose: [new did_core_1.AuthenticationPurpose()],
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    controller: this.getOperationalDID(),
                }))))
            });
            if ('longDid' in response) {
                const sidetreeResponse = response;
                this.addDID({ did: did_1.DID.from(sidetreeResponse.longDid) });
                const h = (args) => {
                    if (args.did.value == response.did) {
                        this.onDidCreated.off(h);
                        if (this.getOperationalDID().isEqual(did_1.DID.from(sidetreeResponse.longDid))) {
                            this.setOperationalDID(args.did);
                        }
                    }
                };
                yield this.setOperationalDID(did_1.DID.from(sidetreeResponse.longDid));
                this.onDidCreated.on(h);
            }
            this.addDID({ did: did_1.DID.from(response.did) });
            this.waitForDIDPublish(did_1.DID.from(response.did));
            return did_1.DID.from(response.did);
        });
    }
    checkDIDPublished(shortDid, setAsOperationalAfterDIDPublish = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const didDocument = yield this.resolver.resolve(shortDid);
            if (didDocument) {
                if (setAsOperationalAfterDIDPublish) {
                    this.setOperationalDID(shortDid);
                }
                this.onDidCreated.trigger({ did: shortDid });
                return true;
            }
            return false;
        });
    }
    waitForDIDPublish(shortDid, setAsOperationalAfterDIDPublish = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let interval = null;
            const pollFunc = () => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (yield this.checkDIDPublished(shortDid, setAsOperationalAfterDIDPublish)) {
                    if (interval) {
                        clearInterval(interval);
                    }
                }
                resolve();
            }));
            const result = yield this.checkDIDPublished(shortDid, setAsOperationalAfterDIDPublish);
            if (result)
                return;
            interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                yield pollFunc();
            }), 5000);
        });
    }
    updateDID(params) {
        return __awaiter(this, void 0, void 0, function* () {
            params.did = params.did || this.getOperationalDID();
            const didDoc = yield this.resolver.resolveWithMetdata(params.did);
            const keys = (yield this.kms.getPublicKeysBySuiteType(kms_core_1.Suite.ES256k)).map(jwk => ({
                jwk,
                updateCommitmentHash: modena_sdk_1.UpdateCommitmentUtils.getUpdateCommitmentHash(jwk),
            }));
            const updateKey = keys.find(x => didDoc.didDocumentMetadata.method.updateCommitment.some(y => y == x.updateCommitmentHash));
            const newUpdateKey = yield this.kms.create(kms_core_1.Suite.ES256k);
            params.verificationMethodsToAdd = params.verificationMethodsToAdd || [];
            const didCommKeys = yield Promise.all(params.verificationMethodsToAdd
                .filter((x) => x.vmKey == agent_registry_1.VMKey.DIDComm)
                .map((x) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    id: x.id,
                    pbk: yield this.kms.create(kms_core_1.Suite.DIDCommV2),
                });
            })));
            const bbsbls2020Keys = yield Promise.all(params.verificationMethodsToAdd
                .filter((x) => x.vmKey == agent_registry_1.VMKey.VC)
                .map((x) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    id: x.id,
                    pbk: yield this.kms.create(kms_core_1.Suite.Bbsbls2020),
                });
            })));
            const rsaKeys = yield Promise.all(params.verificationMethodsToAdd
                .filter((x) => x.vmKey == agent_registry_1.VMKey.RSA)
                .map((x) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    id: x.id,
                    pbk: yield this.kms.create(kms_core_1.Suite.RsaSignature2018),
                });
            })));
            const es256kKeys = yield Promise.all(params.verificationMethodsToAdd
                .filter((x) => x.vmKey == agent_registry_1.VMKey.ES256k)
                .map((x) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    id: x.id,
                    pbk: yield this.kms.create(kms_core_1.Suite.ES256k),
                });
            })));
            let time = Date.now();
            if (params.dwnUrl) {
                for (let dwn of params.dwnUrl) {
                    dwn.id = dwn.id || `dwn-service-${time++}`;
                    params.servicesToAdd = params.servicesToAdd || new Array;
                    params.servicesToAdd.push({
                        id: dwn.id,
                        type: 'DecentralizedWebNode',
                        serviceEndpoint: {
                            nodes: typeof params.dwnUrl === 'string' ? [params.dwnUrl] : params.dwnUrl,
                        },
                    });
                }
            }
            yield this.registry.updateDIDDocument({
                did: params.did,
                updatePublicKey: updateKey.jwk,
                kms: this.kms,
                documentMetadata: didDoc.didDocumentMetadata,
                newUpdateKeys: [...(params.controllersToAdd || []), newUpdateKey.publicKeyJWK],
                servicesToAdd: params.servicesToAdd,
                idsOfServiceToRemove: params.idsOfServiceToRemove,
                idsOfVerificationMethodsToRemove: params.idsOfVerificationMethodsToRemove,
                updateKeysToRemove: params.updateKeysToRemove,
                verificationMethodsToAdd: didCommKeys
                    .map((x) => ({
                    id: x.id,
                    publicKeyJwk: x.pbk.publicKeyJWK,
                    purpose: [new did_core_1.KeyAgreementPurpose()],
                    type: 'X25519KeyAgreementKey2019',
                    controller: this.getOperationalDID(),
                }))
                    .concat(bbsbls2020Keys
                    .map((x) => ({
                    id: x.id,
                    publicKeyJwk: x.pbk.publicKeyJWK,
                    purpose: [new did_core_1.AssertionMethodPurpose()],
                    type: 'Bls12381G1Key2020',
                    controller: this.getOperationalDID(),
                }))
                    .concat(rsaKeys.map((x) => ({
                    id: x.id,
                    publicKeyJwk: x.pbk.publicKeyJWK,
                    purpose: [new did_core_1.AuthenticationPurpose()],
                    type: 'RsaSignature2018',
                    controller: this.getOperationalDID(),
                })))
                    .concat(es256kKeys.map((x) => ({
                    id: x.id,
                    publicKeyJwk: x.pbk.publicKeyJWK,
                    purpose: [new did_core_1.AuthenticationPurpose()],
                    type: 'EcdsaSecp256k1VerificationKey2019',
                    controller: this.getOperationalDID(),
                })))),
                // verificationMethodsToAdd: didCommKeys
                //   .map((x) => ({
                //     id: x.id,
                //     publicKeyJwk: x.pbk.publicKeyJWK,
                //     purpose: [new KeyAgreementPurpose()],
                //     type: 'X25519KeyAgreementKey2019',
                //     controller: this.getOperationalDID(),
                //   }))
                //   .concat(
                //     bbsbls2020Keys
                //       .map((x) => ({
                //         id: x.id,
                //         publicKeyJwk: x.pbk.publicKeyJWK,
                //         purpose: [new AssertionMethodPurpose()],
                //         type: 'Bls12381G1Key2020',
                //         controller: this.getOperationalDID(),
                //       }))
                //       .concat(
                //         rsaKeys.map((x) => ({
                //           id: x.id,
                //           publicKeyJwk: x.pbk.publicKeyJWK,
                //           purpose: [new AuthenticationPurpose()],
                //           type: 'RsaSignature2018',
                //           controller: this.getOperationalDID(),
                //         }))
                //       )
                //   ),
            });
        });
    }
    exportKeys(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield this.kms.getAllPublicKeys();
            const exportResult = yield params.exportBehavior.export({
                dids: this._dids,
                operationalDID: this.getOperationalDID().value,
                keys: yield Promise.all(keys.map((x) => __awaiter(this, void 0, void 0, function* () {
                    return ({
                        publicKeyHex: kms_core_1.BaseConverter.convert(x, kms_core_1.Base.JWK, kms_core_1.Base.Hex, x.kty),
                        secret: yield this.kms.export(x),
                    });
                }))),
            });
            return exportResult;
        });
    }
    importKeys(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const importResult = yield params.exportBehavior.import(params.exportResult);
            if (importResult.dids.length == 0)
                throw new Error('agent importKeys requires at least one did in exportResult');
            yield Promise.all(importResult.keys.map((key) => __awaiter(this, void 0, void 0, function* () {
                return this.kms.import({
                    publicKeyHex: key.publicKeyHex,
                    secret: key.secret,
                });
            })));
            this._dids = importResult.dids;
            yield this.agentStorage.add(AGENT_DID_KEY, this._dids);
            yield this.setOperationalDID(did_1.DID.from(importResult.operationalDID || this._dids[0]));
        });
    }
}
exports.AgentIdentity = AgentIdentity;
//# sourceMappingURL=agent-identity.js.map