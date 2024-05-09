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
exports.WebsocketTransport = void 0;
const did_core_1 = require("@extrimian/did-core");
const lite_event_1 = require("../../utils/lite-event");
const did_1 = require("../did");
const connectable_transport_1 = require("./connectable-transport");
class WebsocketTransport extends connectable_transport_1.ConnectableTransport {
    constructor(wsDidDocumentId = 'MessagingWebSocket') {
        super();
        this.wsDidDocumentId = wsDidDocumentId;
        this.onMessageArrived = new lite_event_1.LiteEvent();
        this.connectedSockets = new Map();
    }
    get messageArrived() {
        return this.onMessageArrived.expose();
    }
    dispose(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params === null || params === void 0 ? void 0 : params.did) {
                const socket = this.connectedSockets.get(params.did.value);
                if (socket) {
                    socket.disconnect();
                }
                this.connectedSockets.delete(params.did.value);
                return;
            }
            else {
                for (const socket of this.connectedSockets.values()) {
                    socket.disconnect();
                }
            }
        });
    }
    initialize(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.agent = params.agent;
            this.onMessageArrived.on((data) => __awaiter(this, void 0, void 0, function* () {
                yield this.handleMessage(data, this);
            }));
        });
    }
    transportSupportedByTarget(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectedClient = this.connectedSockets.get(params.targetDID.value);
            if (connectedClient)
                return true;
            const resolver = this.agent.resolver;
            const targetDidDocument = yield resolver.resolve(params.targetDID);
            try {
                const websocketUrl = did_core_1.DIDDocumentUtils.getServiceUrl(targetDidDocument, this.wsDidDocumentId)[0];
                return !!websocketUrl;
            }
            catch (_a) {
                return false;
            }
        });
    }
    listenToSocket(socket, params) {
        socket.on('message', (data) => {
            var _a, _b;
            const existingSocket = this.connectedSockets.get(data.did);
            if (!existingSocket) {
                this.connectedSockets.set(data.did, socket);
            }
            this.onMessageArrived.trigger({
                data: ((_a = data.message) === null || _a === void 0 ? void 0 : _a.message)
                    ? JSON.parse(data.message.message)
                    : data.message,
                from: did_1.DID.from(data.did),
                context: {
                    messageManagerCompatible: !!((_b = data.message) === null || _b === void 0 ? void 0 : _b.message),
                },
            });
        });
        socket.on('connect', () => {
            this.handleConnect({ did: params === null || params === void 0 ? void 0 : params.did });
        });
        socket.on('disconnect', () => {
            const socketsByDid = Array.from(this.connectedSockets.entries());
            socketsByDid.forEach(([did, socket]) => {
                if (socket.disconnected) {
                    this.handleDisconnect({ did: did_1.DID.from(did) });
                    this.connectedSockets.delete(did);
                }
            });
        });
    }
}
exports.WebsocketTransport = WebsocketTransport;
//# sourceMappingURL=websocket-transport.js.map