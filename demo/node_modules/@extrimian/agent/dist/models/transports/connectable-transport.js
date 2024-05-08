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
exports.ConnectableTransport = void 0;
const lite_event_1 = require("../../utils/lite-event");
class ConnectableTransport {
    constructor() {
        this.onMessageArrived = new lite_event_1.LiteEvent();
    }
    handleConnect(params) {
        this.agent.transport.handleConnect({ did: params.did });
    }
    handleDisconnect(params) {
        this.agent.transport.handleDisconnect({ did: params.did });
    }
    initialize(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.agent = params.agent;
        });
    }
    get messageArrived() {
        return this.onMessageArrived.expose();
    }
    handleMessage(params, transport) {
        return this.agent.transport.handleMessage(params, transport);
    }
}
exports.ConnectableTransport = ConnectableTransport;
//# sourceMappingURL=connectable-transport.js.map