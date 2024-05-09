import { AgentSecureStorage } from "../agent-secure-storage";
export declare class FileSystemAgentSecureStorage implements AgentSecureStorage {
    readonly filepath: string;
    constructor(params: {
        filepath: string;
    });
    add(key: string, data: any): Promise<void>;
    get(key: string): Promise<any>;
    getAll(): Promise<Map<string, any>>;
    update(key: string, data: any): void;
    remove(key: string): void;
    private getData;
    private saveData;
}
