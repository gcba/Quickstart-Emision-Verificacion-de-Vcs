import { Agent, AgentModenaUniversalRegistry, AgentModenaUniversalResolver, DWNTransport, WebsocketServerTransport } from '@quarkid/agent';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AgentService } from './app.service';
import { MessagingGateway } from './messaging.gateway';
import { FileSystemAgentSecureStorage, FileSystemStorage } from './storage';
import { WACIProtocolService } from './waci-protocol-utils';

const agentProvider = {
  provide: Agent,
  useFactory: async (wps: WACIProtocolService,
    transport: WebsocketServerTransport
  ) => {
    const agent = new Agent({
      agentStorage: new FileSystemStorage({ filepath: "issuer-storage-ws.json" }),
      didDocumentRegistry: new AgentModenaUniversalRegistry("https://node-ssi.buenosaires.gob.ar", "did:quarkid"),
      didDocumentResolver: new AgentModenaUniversalResolver("https://node-ssi.buenosaires.gob.ar"),
      secureStorage: new FileSystemAgentSecureStorage({ filepath: "issuer-secure-storage-ws.json" }),
      vcProtocols: [wps.getWaciProtocol()],
      vcStorage: new FileSystemStorage({ filepath: "issuer-vc-storage-ws.json" }),
      supportedTransports: [transport, new DWNTransport()],
    });

    await agent.initialize();

    if (agent.identity.getOperationalDID() == null) {
      const waitDIDCreation = new Promise<void>(async (resolve, reject) => {
        agent.identity.didCreated.on((args) => {
          resolve();
        })

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
  inject: [WACIProtocolService,
    WebsocketServerTransport
  ]
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AgentService,
    WACIProtocolService,
    agentProvider,
    {
      provide: WebsocketServerTransport,
      useClass: WebsocketServerTransport,
    },
    MessagingGateway
  ],
})
export class AppModule { }
