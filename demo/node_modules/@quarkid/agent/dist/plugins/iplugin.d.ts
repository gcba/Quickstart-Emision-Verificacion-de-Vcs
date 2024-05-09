import { Agent } from "../agent";
import { DID } from "../models/did";
export interface IAgentPlugin {
    canHandle(input: IAgentPluginMessage): Promise<boolean>;
    handle(input: IAgentPluginMessage): Promise<IAgentPluginResponse>;
    initialize(params: {
        agent: Agent;
    }): Promise<void>;
}
export interface IAgentPluginResponse {
    to: DID;
    message: any;
}
export interface IAgentPluginMessage {
    message: any;
    contextMessage?: any;
}
