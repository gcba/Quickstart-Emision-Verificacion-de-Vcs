import { AgentService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AgentService);
    getInvitationMessage(): Promise<{
        invitationId: string;
        invitationContent: string;
    }>;
    getVerificationMessage(): Promise<{
        invitationId: string;
        invitationContent: string;
    }>;
}
