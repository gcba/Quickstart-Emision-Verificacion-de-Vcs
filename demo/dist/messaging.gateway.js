"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const agent_1 = require("@quarkid/agent");
let MessagingGateway = class MessagingGateway {
    constructor(transport) {
        this.transport = transport;
        console.log("MessagingGateway");
    }
    afterInit(server) {
        this.transport.initializeServer(server);
        common_1.Logger.log('Websocket server initialized', this.constructor.name);
    }
    handleConnection(client) {
        common_1.Logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        common_1.Logger.log(`Client disconnected: ${client.id}`);
    }
};
exports.MessagingGateway = MessagingGateway;
exports.MessagingGateway = MessagingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [agent_1.WebsocketServerTransport])
], MessagingGateway);
//# sourceMappingURL=messaging.gateway.js.map