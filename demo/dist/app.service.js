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
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const agent_1 = require("@quarkid/agent");
const waci_protocol_utils_1 = require("./waci-protocol-utils");
const base_64_1 = require("base-64");
const QRCodeTerminal = require("qrcode-terminal");
let AgentService = class AgentService {
    constructor(agent, wps) {
        this.agent = agent;
        this.wps = wps;
        this.map = new Map();
        console.log("WPS", wps);
        agent.vc.credentialIssued.on((args) => {
            console.log(args.vc);
        });
        agent.vc.presentationVerified.on(async (args) => {
            const data = await wps.getStorage().get(args.thid);
            const thId = data[0].pthid;
            console.log("WACI InvitationId", thId);
        });
        agent.vc.ackCompleted.on(async (args) => {
        });
    }
    async getInvitationMessage() {
        const invitationMessage = await this.agent.vc.createInvitationMessage({ flow: agent_1.CredentialFlow.Issuance });
        console.log(invitationMessage.replace("didcomm://?_oob=", ""));
        const decoded = (0, base_64_1.decode)(invitationMessage.replace("didcomm://?_oob=", ""));
        console.log(decoded);
        const decodedMessage = JSON.parse(decoded);
        return {
            invitationId: decodedMessage.id,
            invitationContent: invitationMessage,
        };
    }
    async getVerificationMessage() {
        const invitationMessage = await this.agent.vc.createInvitationMessage({ flow: agent_1.CredentialFlow.Presentation });
        console.log(invitationMessage.replace("didcomm://?_oob=", ""));
        const decoded = (0, base_64_1.decode)(invitationMessage.replace("didcomm://?_oob=", ""));
        console.log(decoded);
        const decodedMessage = JSON.parse(decoded);
        QRCodeTerminal.generate(invitationMessage, { small: true });
        return {
            invitationId: decodedMessage.id,
            invitationContent: invitationMessage,
        };
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agent_1.Agent, waci_protocol_utils_1.WACIProtocolService])
], AgentService);
//# sourceMappingURL=app.service.js.map