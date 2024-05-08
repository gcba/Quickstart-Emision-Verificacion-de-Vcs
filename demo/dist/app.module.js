"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const agent_1 = require("@extrimian/agent");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const messaging_gateway_1 = require("./messaging.gateway");
const storage_1 = require("./storage");
const waci_protocol_utils_1 = require("./waci-protocol-utils");
const agentProvider = {
    provide: agent_1.Agent,
    useFactory: async (wps, transport) => {
        const agent = new agent_1.Agent({
            agentStorage: new storage_1.FileSystemStorage({ filepath: "issuer-storage-ws.json" }),
            didDocumentRegistry: new agent_1.AgentModenaUniversalRegistry("https://node-ssi.buenosaires.gob.ar", "did:quarkid"),
            didDocumentResolver: new agent_1.AgentModenaUniversalResolver("https://node-ssi.buenosaires.gob.ar"),
            secureStorage: new storage_1.FileSystemAgentSecureStorage({ filepath: "issuer-secure-storage-ws.json" }),
            vcProtocols: [wps.getWaciProtocol()],
            vcStorage: new storage_1.FileSystemStorage({ filepath: "issuer-vc-storage-ws.json" }),
            supportedTransports: [transport, new agent_1.DWNTransport()],
        });
        await agent.initialize();
        if (agent.identity.getOperationalDID() == null) {
            const waitDIDCreation = new Promise(async (resolve, reject) => {
                agent.identity.didCreated.on((args) => {
                    resolve();
                });
                await agent.identity.createNewDID({
                    services: [
                        {
                            id: 'websocket',
                            type: "MessagingWebSocket",
                            serviceEndpoint: "https://248c-161-22-25-244.ngrok-free.app",
                        },
                    ],
                });
            });
            await waitDIDCreation;
        }
        wps.setCurrentAgent(agent);
        return agent;
    },
    inject: [waci_protocol_utils_1.WACIProtocolService,
        agent_1.WebsocketServerTransport
    ]
};
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AgentService,
            waci_protocol_utils_1.WACIProtocolService,
            agentProvider,
            {
                provide: agent_1.WebsocketServerTransport,
                useClass: agent_1.WebsocketServerTransport,
            },
            messaging_gateway_1.MessagingGateway
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map