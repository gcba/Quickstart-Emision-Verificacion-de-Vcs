import { Agent, WACIProtocol } from "@quarkid/agent";
import { FileSystemStorage } from "./storage";
export declare class WACIProtocolService {
    agent: Agent;
    constructor();
    setCurrentAgent(agent: Agent): void;
    getStorage(): FileSystemStorage;
    getWaciProtocol(): WACIProtocol;
}
