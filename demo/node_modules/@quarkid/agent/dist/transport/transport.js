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
exports.AgentTransport = void 0;
const dwn_transport_1 = require("../models/transports/dwn-transport");
const lite_event_1 = require("../utils/lite-event");
const NodeCache = require("node-cache");
class AgentTransport {
    get messageArrived() { return this.onMessageArrived.expose(); }
    get connected() { return this.onConnected.expose(); }
    get disconnected() { return this.onDisconnected.expose(); }
    constructor(params) {
        this.onMessageArrived = new lite_event_1.LiteEvent();
        this.onConnected = new lite_event_1.LiteEvent();
        this.onDisconnected = new lite_event_1.LiteEvent();
        this.cacheStorage = new NodeCache({ stdTTL: 100, checkperiod: 120 });
        this.agent = params.agent;
        if (!params.transports) {
            params.transports = Array();
            params.transports.push(new dwn_transport_1.DWNTransport());
        }
        params.agent.identity.identityInitialized.on(() => __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.transports.map((transport) => __awaiter(this, void 0, void 0, function* () {
                return yield transport.initialize({
                    agent: params.agent
                });
            })));
        }));
        this.transports = params.transports;
    }
    handleConnect(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.onConnected.trigger({
                did: params.did
            });
        });
    }
    handleDisconnect(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.onDisconnected.trigger({
                did: params.did
            });
        });
    }
    handleMessage(params, transport) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.info("Message arrived using", (_a = transport.constructor) === null || _a === void 0 ? void 0 : _a.name);
            const unpackedMessage = yield this.agent.messaging.unpackMessage({
                message: params.data,
            });
            if (unpackedMessage === null || unpackedMessage === void 0 ? void 0 : unpackedMessage.id) {
                this.cacheStorage.set(unpackedMessage.id, transport.constructor.name);
            }
            this.onMessageArrived.trigger({
                message: unpackedMessage,
                transport: transport,
                contextMessage: params.context
            });
        });
    }
    addTransports(transport) {
    }
    getTranportByMessageId(messageId) {
        const transportName = this.cacheStorage.get(messageId);
        if (transportName != null) {
            return this.transports.find(x => x.constructor.name == transportName);
        }
        return null;
    }
    sendMessage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.preferredTransport) {
                const result = yield this.sendMessageUsingTransport({
                    to: params.to,
                    from: params.from,
                    transport: params.preferredTransport,
                    messageContext: params.messageContext,
                    message: params.message
                });
                if (result)
                    return;
            }
            for (let transport of this.transports) {
                if (!params.preferredTransport || transport != params.preferredTransport) {
                    if (yield transport.transportSupportedByTarget({ targetDID: params.to })) {
                        const result = yield this.sendMessageUsingTransport({
                            to: params.to,
                            from: params.from,
                            transport: transport,
                            messageContext: params.messageContext,
                            message: params.message
                        });
                        if (result)
                            return;
                    }
                }
            }
            console.info(`The message could not be sent to ${params.to.value} because the transport layers have thrown errors or because the DIDs do not share common transport layers.`);
        });
    }
    sendMessageUsingTransport(params) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.info("Sending message to", params.to.value, "using", (_b = (_a = params.transport) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name);
                yield params.transport.send({
                    data: params.message,
                    to: params.to,
                    from: params.from,
                    context: params.messageContext
                });
                return true;
            }
            catch (ex) {
                console.error(`Error sending message to ${params.to.value} using ${(_d = (_c = params.transport) === null || _c === void 0 ? void 0 : _c.constructor) === null || _d === void 0 ? void 0 : _d.name}.`);
                return false;
            }
        });
    }
}
exports.AgentTransport = AgentTransport;
//# sourceMappingURL=transport.js.map