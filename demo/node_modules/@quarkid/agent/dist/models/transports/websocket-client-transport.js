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
exports.WebsocketClientTransport = void 0;
const did_core_1 = require("@extrimian/did-core");
const socket_io_client_1 = require("socket.io-client");
const did_1 = require("../did");
const websocket_transport_1 = require("./websocket-transport");
class WebsocketClientTransport extends websocket_transport_1.WebsocketTransport {
    send(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingSocket = this.connectedSockets.get(params.to.value);
            if (!existingSocket) {
                const resolver = this.agent.resolver;
                const targetDidDocument = yield resolver.resolve(params.to);
                try {
                    const websocketUrl = did_core_1.DIDDocumentUtils.getServiceUrl(targetDidDocument, this.wsDidDocumentId)[0];
                    const socket = (0, socket_io_client_1.connect)(websocketUrl);
                    this.listenToSocket(socket, { did: did_1.DID.from(params.to.value) });
                    this.connectedSockets.set(params.to.value, socket);
                }
                catch (ex) {
                    throw new Error('Error getting websocket endpoint in did document');
                }
            }
            const socket = this.connectedSockets.get(params.to.value);
            if (!socket)
                throw new Error(`No socket found for DID ${params.to.value}`);
            socket.emit('message', {
                message: params.data,
                did: this.agent.identity.getOperationalDID().value,
            });
        });
    }
}
exports.WebsocketClientTransport = WebsocketClientTransport;
//# sourceMappingURL=websocket-client-transport.js.map