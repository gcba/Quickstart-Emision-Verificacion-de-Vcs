"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketServerTransport = void 0;
const websocket_transport_1 = require("./websocket-transport");
class WebsocketServerTransport extends websocket_transport_1.WebsocketTransport {
    initializeServer(socketServer) {
        socketServer.on('connection', (client) => {
            this.listenToSocket(client);
        });
    }
    send(params) {
        const socket = this.connectedSockets.get(params.to.value);
        if (!socket)
            throw new Error(`No socket found for DID ${params.to.value}`);
        socket.emit('message', {
            message: params.data,
            did: this.agent.identity.getOperationalDID().value,
        });
    }
}
exports.WebsocketServerTransport = WebsocketServerTransport;
//# sourceMappingURL=websocket-server-transport.js.map