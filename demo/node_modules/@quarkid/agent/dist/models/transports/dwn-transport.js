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
exports.inMemoryMessageStorage = exports.DWNTransport = void 0;
const did_core_1 = require("@extrimian/did-core");
const dwn_client_1 = require("@extrimian/dwn-client");
const lite_event_1 = require("../../utils/lite-event");
const did_1 = require("../did");
var AsyncLock = require('async-lock');
var lock = new AsyncLock();
class DWNTransport {
    get messageArrived() {
        return this.onMessageArrived.expose();
    }
    constructor(params) {
        this.onMessageArrived = new lite_event_1.LiteEvent();
        this.dwnClientMap = new Map();
        this.dwnPollMilliseconds = (params === null || params === void 0 ? void 0 : params.dwnPollMilliseconds) || 10000;
    }
    transportSupportedByTarget(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetDidDocument = yield this.resolver.resolve(params.targetDID);
            const dwnUrl = yield did_core_1.DIDDocumentUtils.getServiceUrl(targetDidDocument, 'DecentralizedWebNode', 'nodes')[0];
            return dwnUrl != null;
        });
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: dispose
        });
    }
    processNewDID(did, initialzing = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield lock.acquire("dwnClients", () => __awaiter(this, void 0, void 0, function* () {
                if (this.dwnClientMap.get(did.value))
                    return;
                if (!did.isLongDID()) {
                    const longDidDWNClient = Array.from(this.dwnClientMap.keys()).map(x => did_1.DID.from(x)).find(x => x.isLongDIDFor(did));
                    //Si ya existe un dwn transport polleando el long, se debe eliminar ese polleo y comenzar a pollear el short.
                    if (longDidDWNClient) {
                        this.dwnClientMap.delete(longDidDWNClient.value);
                    }
                }
                else {
                    const shortDidDWNClient = Array.from(this.dwnClientMap.keys()).map(x => did_1.DID.from(x)).find(x => x.isShortDIDFor(did));
                    //Si ya existe un dwn transport polleando el short, no se debe pollear el DWN del longDID.
                    if (shortDidDWNClient)
                        return;
                }
                const didDocument = yield this.resolver.resolve(did);
                let dwnClient;
                try {
                    const dwnEndpoint = this.getServiceUrl(didDocument, 'DecentralizedWebNode', 'nodes');
                    if (!dwnEndpoint)
                        return;
                    dwnClient = new dwn_client_1.DWNClient({
                        did: did.value,
                        storage: exports.inMemoryMessageStorage,
                        inboxURL: dwnEndpoint[0],
                    });
                }
                catch (ex) {
                    console.error('An error occurred while polling for the DWN: DIDDocument has not a DWN service defined or it is not correct');
                    return;
                }
                this.dwnClientMap.set(did.value, dwnClient);
                dwnClient.addSubscriber((messages) => __awaiter(this, void 0, void 0, function* () {
                    messages.forEach((message) => {
                        //Los mensajes de DIDComm en el DWN vienen con caracteres extraños y no permiten JSON.parsear el string si no se remueven esos caracteres.
                        let messageManagerCompatible = false;
                        if (message.data.message) {
                            message.data = JSON.parse(message.data.message);
                            messageManagerCompatible = true;
                        }
                        if (typeof message.data === 'string' &&
                            message.data.indexOf('{') != 0 &&
                            message.data.indexOf('"header":{"alg":"ECDH-1PU') > -1) {
                            message.data = message.data.substring(message.data.indexOf('{'), message.data.lastIndexOf('}') + 1);
                        }
                        this.onMessageArrived.trigger({
                            from: null,
                            // from: messages[0].data?.message?.from,
                            data: message.data,
                            context: Object.assign(Object.assign({}, message), { messageManagerCompatible }),
                        });
                    });
                }));
                if (!initialzing) {
                    this.startPollSpecificClient(did.value, dwnClient);
                }
            }));
        });
    }
    initialize(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.agent = params.agent;
            this.resolver = this.agent.resolver;
            const dids = this.agent.identity.getDIDs();
            for (let did of dids) {
                yield this.processNewDID(did_1.DID.from(did), true);
            }
            Array.from(this.dwnClientMap.keys()).forEach(did => {
                this.startPollSpecificClient(did, this.dwnClientMap.get(did));
            });
            this.agent.identity.didCreated.on((args) => {
                this.processNewDID(args.did);
            });
            this.onMessageArrived.on((data) => __awaiter(this, void 0, void 0, function* () {
                yield this.agent.transport.handleMessage(data, this);
            }));
        });
    }
    send(params) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const targetDidDocument = yield this.resolver.resolve(params.to);
            const dwnUrl = yield did_core_1.DIDDocumentUtils.getServiceUrl(targetDidDocument, 'DecentralizedWebNode', 'nodes')[0];
            const msgParams = {
                targetDID: params.to.value,
                targetInboxURL: dwnUrl,
                message: {
                    data: ((_a = params.context) === null || _a === void 0 ? void 0 : _a.messageManagerCompatible)
                        ? { message: JSON.stringify(params.data) }
                        : params.data,
                    descriptor: {
                        method: undefined,
                        dateCreated: new Date(),
                        dataFormat: 'application/json',
                    },
                },
            };
            if (!((_c = (_b = params.context) === null || _b === void 0 ? void 0 : _b.descriptor) === null || _c === void 0 ? void 0 : _c.method)) {
                msgParams.message.descriptor.method = dwn_client_1.ThreadMethod.Create;
            }
            else {
                msgParams.message.descriptor.method = dwn_client_1.ThreadMethod.Reply;
                msgParams.message.descriptor.root =
                    params.context.descriptor.root || params.context.descriptor.objectId;
                msgParams.message.descriptor.parent = params.context.descriptor.objectId;
            }
            yield this.dwnClientMap
                .get(this.agent.identity.getOperationalDID().value)
                .sendMessage(msgParams)
                .catch(console.error);
        });
    }
    startPollSpecificClient(did, dwnClient) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield dwnClient.pullNewMessageWait();
            }
            catch (_a) {
                console.error("Error polling DWNClient for DID", did);
            }
            finally {
                setTimeout(() => {
                    if (this.dwnClientMap.get(did)) {
                        this.startPollSpecificClient(did, dwnClient);
                    }
                }, this.dwnPollMilliseconds);
            }
        });
    }
    getServiceUrl(didDocument, serviceType, serviceEndpointMapKey) {
        var _a;
        try {
            const service = (_a = didDocument.service) === null || _a === void 0 ? void 0 : _a.find((service) => service.type === serviceType);
            if (!service)
                return null;
            if (typeof service.serviceEndpoint === 'object')
                return service.serviceEndpoint[serviceEndpointMapKey];
            return [service.serviceEndpoint];
        }
        catch (error) {
            console.error(error);
            throw Error(`Error finding ${serviceType} service in DID Document`);
        }
    }
}
exports.DWNTransport = DWNTransport;
const messagesStorage = [];
let lastPullDate;
exports.inMemoryMessageStorage = {
    getMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            return messagesStorage;
        });
    },
    getLastPullDate() {
        return __awaiter(this, void 0, void 0, function* () {
            return lastPullDate;
        });
    },
    updateLastPullDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            lastPullDate = date;
        });
    },
    saveMessages(messages) {
        return __awaiter(this, void 0, void 0, function* () {
            messagesStorage.push(...messages);
        });
    },
};
//# sourceMappingURL=dwn-transport.js.map