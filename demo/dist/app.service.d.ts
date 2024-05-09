import { Agent } from "@quarkid/agent";
import { WACIProtocolService } from './waci-protocol-utils';
export declare class AgentService {
    private readonly agent;
    private readonly wps;
    constructor(agent: Agent, wps: WACIProtocolService);
    getInvitationMessage(): Promise<{
        invitationId: string;
        invitationContent: string;
    }>;
    map: Map<string, {
        firstName: string;
        lastName: string;
    }>;
    getVerificationMessage(): Promise<{
        invitationId: string;
        invitationContent: string;
    }>;
}
